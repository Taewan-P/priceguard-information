import * as fs from "fs";
import * as showdown from "showdown";

const readFileContents = async (filename: string): Promise<string> => {
  try {
    const data = await fs.promises.readFile(filename, "utf8")
    console.log(`Current directory: ${process.cwd()}`)
    return data
  } catch (err) {
    console.error(err)
    return ""
  }
}

const createCustomHtmlFile = (title: string, htmlContent: string): void => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" type="text/css" href="github-markdown.css"/>
          <style>
            .markdown-body {
              box-sizing: border-box;
              min-width: 200px;
              max-width: 980px;
              margin: 0 auto;
              padding: 45px;
            }

            @media (max-width: 767px) {
              .markdown-body {
                padding: 15px;
              }
            }
          </style>
          <title>${title}</title>
          </head>
          <body class="markdown-body">
            ${htmlContent}
            <script>
              const themeCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('_theme='))
                ?.split('=')[1];

                if (themeCookie === undefined) {
                  console.log("Theme color not detected.")
                }

                if (themeCookie === 'dark') {
                  document.body.setAttribute('data-theme', 'dark');
                } else {
                  document.body.setAttribute('data-theme', 'light');
                }
            </script>
        </body>
      </html>
    `;
    
    fs.promises.mkdir("./dist", { recursive: true }).then(() => {
      fs.writeFile("./dist/index.html", html, (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log("File created successfully")
      })
    }).catch((err) => console.error(err))
  }

const convertFile = async (title: string, filename: string): Promise<void> => {
    const data = await readFileContents(filename)
    const converter = new showdown.Converter()
    converter.setFlavor('github')
    const initialHtml = converter.makeHtml(data)
    createCustomHtmlFile(title, initialHtml)
}

convertFile("상품 링크는 어떻게 얻나요? - PriceGuard", "README.md")
