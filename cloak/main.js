async function openCustom() {
    const html = textarea.value;
    const mode = "replace"; // or "add", you could add a select later

    // Send HTML to backend to generate the JS file
    const res = await fetch("https://YOUR_BACKEND_DOMAIN/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, mode })
    });

    const data = await res.json();
    const scriptURL = data.url;

    // Create a blob with HTML that loads the script immediately
    const blobContent = `
<!DOCTYPE html>
<html>
<head><title>Custom Page</title></head>
<body>
<script src="${scriptURL}"></script>
</body>
</html>
`;

    const blob = new Blob([blobContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Open a new tab and show the generated page immediately
    window.open(url, "_blank");
}
