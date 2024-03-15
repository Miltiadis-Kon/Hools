function addElement() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h1>HELLO</h1>
            <p>This is a paragraph.</p> 
            <div id="LogIn">
            <script src="./components/Login.js"></script>
            </div>
            `;
        document.body.appendChild(div);
    }