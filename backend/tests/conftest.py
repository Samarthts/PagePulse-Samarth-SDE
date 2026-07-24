import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """
    FastAPI TestClient fixture for integration testing.
    """
    return TestClient(app)

@pytest.fixture
def sample_html():
    """
    Sample HTML string for unit testing analyzer parser functions.
    """
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Test Domain - Audit Page</title>
        <meta name="description" content="This is a comprehensive test meta description for Page Pulse audit testing.">
        <link rel="icon" href="/assets/favicon.png">
    </head>
    <body>
        <header>
            <nav><a href="/">Home</a></nav>
        </header>
        <main>
            <h1>Welcome to Page Pulse Testing</h1>
            <p>This paragraph contains multiple words to test the word counter functionality accurately.</p>
            <img src="logo.png" alt="Company Logo">
            <img src="banner.png" alt="">
            <img src="icon.png">
        </main>
    </body>
    </html>
    """
