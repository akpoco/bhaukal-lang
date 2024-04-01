
const fs = require('fs');
const path = require('path');

// Function to search for files with a specific extension in a directory
function searchAndPrintFilesByExtension(directoryPath, extension) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Filter files with the specified extension
        const matchingFiles = files.filter(file => path.extname(file) === `.${extension}`);

        if (matchingFiles.length === 0) {
            console.log(`No files with .${extension} extension found in ${directoryPath}`);
        } else {
            let file
            if (process.argv[2].trim().split(".").length === 2 && process.argv[2].trim().split(".")[1] === "bhaukal") {
                file = process.argv[2]
            } else {
                file = process.argv[2] + "." + "bhaukal"
            }

            const filePath = path.join(directoryPath, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                } else {
                    // console.log(`Content of ${file}:`);
                    // console.log(data.length);
                    // console.log(code.length)

                    let code = data + "\n";
                    compiler(code);
                }
            });
        }
    });
}

searchAndPrintFilesByExtension('.', 'bhaukal');

function laxer(input) {
    const tokens = []
    let cursor = 0;

    while (cursor < input.length) {
        let char = input[cursor]

        // skip space;
        if (/\s/.test(char)) {
            cursor++
            continue
        }

        if (/[a-zA-Z]/.test(char)) {
            let word = '';
            while (/[a-zA-Z0-9]/.test(char)) {
                word += char;
                char = input[++cursor]
            }

            if (word === 'bhaukal' || word === "bhaukalMachao") {
                tokens.push({
                    type: 'keyword',
                    value: word
                })
            } else {
                tokens.push({
                    type: 'identifier',
                    value: word
                })
            }

            cursor++
            continue;
        }

        if (/[0-9]/.test(char)) {
            let number = '';
            while (/[0-9]/.test(char)) {
                number += char;
                char = input[++cursor];
            }

            tokens.push({
                type: 'number',
                value: parseInt(number)
            })
            cursor++
            continue
        }

        // tokenize operators and equalTosign
        if (/[=+\-*/]/.test(char)) {
            tokens.push({
                type: 'operator',
                value: char
            })
            cursor++
            continue
        }
    }

    return tokens
}

function parser(tokens) {
    const ast = {
        type: 'Program',
        body: []
    }

    while (tokens.length > 0) {
        let token = tokens.shift();

        if (token.type === 'keyword' && token.value === 'bhaukal') {
            let declaration = {
                type: 'Declaration',
                name: tokens.shift().value,
                value: null
            }


            // check for assignment
            if (tokens[0].type === 'operator' && tokens[0].value === '=') {
                tokens.shift();
                let expression = '';
                while (tokens.length > 0 && tokens[0].type !== 'keyword') {
                    expression += tokens.shift().value
                }

                declaration.value = expression.trim();
            }

            ast.body.push(declaration)
        }

        if (token.type === 'keyword' && token.value === 'bhaukalMachao') {
            ast.body.push(
                {
                    type: "Print",
                    expression: tokens.shift().value
                }
            )
        }
    }

    return ast
}

function codeGen(node) {
    switch (node.type) {
        case 'Program': return node.body.map(codeGen).join('\n');
        case 'Declaration': return `const ${node.name} = ${node.value}`;
        case 'Print': return `console.log(${node.expression})`;
    }
}


function compiler(input) {
    const tokens = laxer(input);

    const ast = parser(tokens);

    const code = codeGen(ast);;

    return eval(code);
}

// console.log(process.argv[2])