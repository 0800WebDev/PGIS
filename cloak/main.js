async function openCustom() {
    const html = textarea.value;
    const mode = "replace";

    const res = await fetch("https://pgis-backend.vercel.app/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, mode })
    });

    const data = await res.json();

    const scriptURL = data.url;

    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = `
<label>Copy this script tag:</label><br>
<textarea style="width:90%;height:60px;">&lt;script src="${scriptURL}"&gt;&lt;/script&gt;</textarea>
<p>Use this script to replace a page with the html from your textarea.</p>
`;
}
