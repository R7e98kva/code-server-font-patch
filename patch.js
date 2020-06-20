const fs = require("fs");
const execSync = require("child_process").execSync;

const execType = process.argv[2];
if (execType !== "install" && execType !== "uninstall") {
    console.log("First argument must either be install or uninstall");
    process.exit(-1);
}

const codeServerPath = process.argv[3] ? process.argv[3] : "/usr/lib/code-server";
const workbenchPath = codeServerPath + "/lib/vscode/out/vs/workbench";
const workbenchCssPath = workbenchPath + "/workbench.web.api.css";

if (!fs.existsSync(workbenchCssPath)) {
    console.log("Please give valid code-server path!");
    process.exit(-1);
}

const cssDelimiter = "\n* This text is used to later remove fonts installed by code-server-font-patch */\n";
const cleanCss = removeAlreadyAddedCss(fs.readFileSync(workbenchCssPath, "utf-8"));

if (execType === "install") {
    removeInstalledFonts();
    execSync("cp -rn ./resources/fonts " + workbenchPath);
    fs.writeFileSync(workbenchCssPath, fs.readFileSync("./resources/fonts.css", "utf-8") + cssDelimiter + cleanCss);

} else if (execType === "uninstall") {
    //remove installed fonts
    removeInstalledFonts();
    fs.writeFileSync(workbenchCssPath, cleanCss);
}

console.log("Done! Have fun!");


function removeInstalledFonts() {
    if (fs.existsSync(workbenchPath + "/fonts")) {
        execSync("rm -r " + workbenchPath + "/fonts");
    }
}

function removeAlreadyAddedCss(cssString) {
    if (cssString.includes(cssDelimiter)) {
        return cssString.split(cssDelimiter)[1];
    } else {
        return cssString;
    }
}
