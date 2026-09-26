import asyncio
import sqlite3
import tempfile
import unittest
from contextlib import closing
from unittest.mock import patch

from fastapi import HTTPException, Response

import main


class GoogleAuthTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.original_db_path = main.auth_db_path
        self.original_client_id = main.GOOGLE_CLIENT_ID
        self.original_browser_client_id = main.GOOGLE_BROWSER_CLIENT_ID
        main.auth_db_path = f"{self.temp_dir.name}/auth.db"
        main.GOOGLE_CLIENT_ID = "web-client.apps.googleusercontent.com"
        main.GOOGLE_BROWSER_CLIENT_ID = main.GOOGLE_CLIENT_ID
        main.init_auth_db()

    def tearDown(self):
        main.auth_db_path = self.original_db_path
        main.GOOGLE_CLIENT_ID = self.original_client_id
        main.GOOGLE_BROWSER_CLIENT_ID = self.original_browser_client_id
        self.temp_dir.cleanup()

    def claims(self, **overrides):
        claims = {
            "iss": "https://accounts.google.com",
            "aud": main.GOOGLE_CLIENT_ID,
            "sub": "google-user-123",
            "email": "person@example.com",
            "email_verified": True,
            "name": "Example Person",
        }
        claims.update(overrides)
        return claims

    def authenticate(self, claims):
        response = Response()
        with patch.object(main.google_id_token, "verify_oauth2_token", return_value=claims) as verifier:
            result = asyncio.run(main.google_auth(main.GoogleAuthRequest(credential="signed.jwt"), response))
        verifier.assert_called_once()
        self.assertEqual(verifier.call_args.args[2], main.GOOGLE_CLIENT_ID)
        return result, response

    def test_rejects_token_for_another_client(self):
        with patch.object(main.google_id_token, "verify_oauth2_token", return_value=self.claims(aud="other-client")):
            with self.assertRaises(HTTPException) as raised:
                asyncio.run(main.google_auth(main.GoogleAuthRequest(credential="signed.jwt"), Response()))

        self.assertEqual(raised.exception.status_code, 401)

    def test_matching_email_does_not_link_or_create_session(self):
        with closing(sqlite3.connect(main.auth_db_path)) as connection, connection:
            connection.execute(
                "INSERT INTO users (phone, email, full_name, username, password_hash, created_at, auth_provider) "
                "VALUES (?, ?, ?, ?, ?, ?, 'password')",
                ("+15555550100", "person@example.com", "Local User", "local_user", main.hash_password("Password1!"), 1),
            )

        response = Response()
        with patch.object(main.google_id_token, "verify_oauth2_token", return_value=self.claims()):
            with self.assertRaises(HTTPException) as raised:
                asyncio.run(main.google_auth(main.GoogleAuthRequest(credential="signed.jwt"), response))

        self.assertEqual(raised.exception.status_code, 409)
        self.assertNotIn("set-cookie", response.headers)
        with closing(sqlite3.connect(main.auth_db_path)) as connection:
            google_sub = connection.execute(
                "SELECT google_sub FROM users WHERE email = ?", ("person@example.com",)
            ).fetchone()[0]
        self.assertIsNone(google_sub)

    def test_returning_google_user_is_found_by_subject(self):
        first_result, first_response = self.authenticate(self.claims())
        second_result, second_response = self.authenticate(
            self.claims(email="new-address@example.com", name="Updated Name")
        )

        self.assertEqual(first_result["user"]["id"], second_result["user"]["id"])
        self.assertEqual(second_result["user"]["email"], "new-address@example.com")
        self.assertIn("httponly", first_response.headers["set-cookie"].lower())
        self.assertIn("httponly", second_response.headers["set-cookie"].lower())


if __name__ == "__main__":
    unittest.main()
