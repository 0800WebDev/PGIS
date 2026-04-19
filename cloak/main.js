async function openCustom() {
    const html = textarea.value;
    const mode = "replace";

    try {
        const res = await fetch("https://pgis-backend.vercel.app/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html, mode })
        });

        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        const data = await res.json();

        const scriptURL = data.url;

        const resultContainer = document.getElementById("result");
        resultContainer.innerHTML = `
<label>Copy this script tag:</label><br>
<textarea style="width:90%;height:60px;">&lt;script src="${scriptURL}"&gt;&lt;/script&gt;</textarea>
<p>Use this script to inject your HTML.</p>
`;

    } catch (err) {
        console.error(err);

        document.getElementById("result").innerHTML = `
<p style="color:red;">Failed to generate script. Check backend.</p>
`;
    }
}
