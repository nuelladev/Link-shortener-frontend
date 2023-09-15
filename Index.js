async function shortenURL(e) {
  e.preventDefault();

  const responseNode = document.getElementById("response");
  const responseAnchorNode = document.getElementById("response-anchor");

  const input = e.target[0].value;

  const isURLValid = validateURL(input);
  if (!isURLValid) return;

  const shortenedURL = await shorten(input);

  if (shortenedURL === undefined) {
    throwError("This URL isn't valid.");
    return;
  }

  responseNode.innerText = shortenedURL;
  responseNode.setAttribute("href", shortenedURL);
  responseAnchorNode.href = shortenedURL;

  throwError(" ");
}

function validateURL(input) {
  if (!input) {
    throwError("You need to type something.");
    return false;
  }

  try {
    new URL(input);
    return true;
  } catch (e) {
    throwError("Could not shorten. This is probably not a URL.");
    return false;
  }
}

async function shorten(input) {
  try {
    const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_BITLY_API_KEY", // Replace with your Bitly API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ long_url: input }),
    });

    if (!response.ok) {
      throwError("Failed to shorten URL.");
      return undefined;
    }

    const data = await response.json();
    return data.link;
  } catch (error) {
    throwError("An error occurred while shortening the URL.");
    return undefined;
  }
}

function throwError(msg) {
  const errorNode = document.getElementById("error");

  errorNode.innerText = msg;
}

function copyURL() {
  const responseAnchorNode = document.getElementById("response-anchor");
  const responseNode = document.getElementById("response");
  const content = responseNode.innerText;

  if (!content) return;

  navigator.clipboard.writeText(content)
    .then(() => {
      responseNode.style.color = "#cf3b3b";
    })
    .catch((error) => {
      console.error("Error copying URL: ", error);
    });
}

const form = document.getElementById("shorten-form");
form.addEventListener("submit", shortenURL);
