var display = document.getElementById("screen");
var inputArea = document.getElementById("input-area");
var buttons = document.getElementsByClassName("button");
var preFixExp;
var postFixExp;
var val1;
var val2;
var returnExp;
var tempString;

var result;
var historyTree = [];
var currHistoryIndex;

var angle_mode = "deg";
var degButton = document.getElementById("deg-button");
var radButton = document.getElementById("rad-button");
var offColor = "#a091ff";
var onColor = "#ebd93d";



Array.prototype.forEach.call(buttons, function (button) {
	button.addEventListener("click", function () {
		if (button.textContent === "=") {
			equals();
		}
		else if (button.textContent === "C") {
			clear();
		}
		else if (button.textContent === "x") {
			multiply();
		}
		else if (button.textContent === "÷") {
			divide();
		}
		else if (button.textContent === "±") {
			plusMinus();
		}
		else if (button.textContent === "<=") {
			backspace();
		}
		else if (button.textContent === "%") {
			percent();
		}
		else if (button.textContent === "π") {
			pi();
		}
		else if (button.textContent === "x ²") {
			square();
		}
		else if (button.textContent === "√") {
			squareRoot();
		}
		else if (button.textContent === "sin") {
			sin();
		}
		else if (button.textContent === "cos") {
			cos();
		}
		else if (button.textContent === "tan") {
			tan();
		}
		else if (button.textContent === "log") {
			log();
		}
		else if (button.textContent === "ln") {
			ln();
		}
		else if (button.textContent === "x^") {
			exponent();
		}
		else if (button.textContent === "x !") {
			factorial();
		}
		else if (button.textContent === "e") {
			e();
		}
		else if (button.textContent === "rad") {
			radians();
		}
		else if (button.textContent === "deg") {
			degrees();
		}
		else if (button.textContent == "ans") {
			ans();
		}
		else if (button.textContent == "↑") {
			up();
		}
		else if (button.textContent == "↓") {
			down();
		}
		else {
			display.value += button.textContent;
		}
	});
});


function syntaxError() {
	if (eval(result) == SyntaxError || eval(result) == ReferenceError || eval(result) == TypeError) {
		result == "Syntax Error";
	}
}

function updateDisplay(expression, result) {
	inputArea.innerHTML += "<p>" + expression + "</p>" + "<p> = " + result + "</p>";

	display.value = "";
	syntaxError()
}

function prec(c) {
	x = 1000;

	if (c == "!") {
		return x;
	}
	x -= 1;
	if (c == "d" || c == "r") {
		return x;
	}
	x -= 1;
	if (c == "s" || c == "c" || c == "t") {
		return x;
	}
	x -= 1;
	if (c == "^") {
		return x;
	}
	x -= 1;
	if (c == "l") {
		return x;
	}
	x -= 1;
	if (c == "n") {
		return x;
	}
	x -= 1;
	if (c == "/" || c == "*") {
		return x;
	}
	x -= 1;
	if (c == "%") {
		return x;
	}
	x -= 1;
	if (c == "+" || c == "-") {
		return x;
	}

	return x - 1;
	
}

function configureInFixExp(exp) {
	let returnExp = [];
	let tempString = "";
	for (let i = 0; i < exp.length; i++) {
		let currentChar = exp[i];

		if (!isNaN(parseInt(currentChar))) {
			tempString += currentChar;
		}
		else if (currentChar == "π" || currentChar == "e") {
			if (i == 0) {
				tempString += currentChar;
			}
			else {
				// check if any implicit multiplication is occurring
				if (tempString.length > 0) {
					returnExp.push("(");
					returnExp.push(tempString);
					returnExp.push("*");
					returnExp.push(currentChar);
					returnExp.push(")");

					tempString = "";
				}
			}
		}
		else {
			if (tempString.length != 0) {
				returnExp.push(tempString);
			}
			if (currentChar != " ") {
				returnExp.push(currentChar);
			}
			if (currentChar == "s" || currentChar == "c" || currentChar == "t") {
				i += 2;
			}
			if (currentChar == "l" && exp[i + 1] == "n") {
				i += 1;

				returnExp[returnExp.length - 1] = "n";
			}
			if (currentChar == "l" && exp[i + 1] == "o") {
				i += 2;
			}
			// if (currentChar == "e") {
			// 	returnExp[returnExp.length - 1] = Math.E;
			// }
			// if (currentChar == "p") {
			// 	i++;
			// 	returnExp[returnExp.length - 1] = Math.PI;
			// }
			if (currentChar == "d") {
				i += 2;
			}
			if (currentChar == "r") {
				i += 2;
			}
			tempString = "";
		}
	}
	if (tempString.length != 0) {
		returnExp.push(tempString);
	}
	return returnExp;
}

function infixToPostFix(s) {
	let stack = [];
	let postFixExp = [];

	for (let i = 0; i < s.length; i++) {
		let char = s[i];


		if (char == " ") {
			continue;
		}

		if (!isNaN(parseInt(char)) || char == "π" || char == "e") {
			postFixExp.push(char);
		}
		else if (char == "(") {
			stack.push("(")
		}
		else if (char == ")") {
			while (stack[stack.length - 1] != "(") {
				postFixExp.push(stack[stack.length - 1]);
				stack.pop();
			}

			stack.pop();
		}

		else {
			while (stack.length != 0 && prec(char) <= prec(stack[stack.length - 1])) {
				postFixExp.push(stack[stack.length - 1]);
				stack.pop();
			}

			stack.push(char);
		}
		console.log("");
	}

	while (stack.length != 0) {
		postFixExp.push(stack[stack.length - 1]);
		stack.pop();
	}

	return postFixExp;
}


function evaluatePostFix(exp) {
	let stack = [];

	for (let i = 0; i < exp.length; i++) {
		let char = exp[i];

		if (!isNaN(parseInt(char))) {
			stack.push(parseFloat(char));
		}
		else if (char == "π") {
			stack.push(Math.PI);
		}
		else if (char == "e") {
			stack.push(Math.E);
		}
		else {
			let val1;
			let val2;
			let twoElementsNeeded = "+-*/^%";

			val1 = stack.pop();

			if (twoElementsNeeded.includes(char)) {
				val2 = stack.pop();
			}

			switch (char) {
				case "+":
					stack.push(val2 + val1);
					break;

				case "-":
					stack.push(val2 - val1);
					break;

				case "/":
					stack.push(val2 / val1);
					break;

				case "*":
					stack.push(val2 * val1);
					break;
				
				case "^":
					stack.push(val2 ** val1);
					break;

				case "s":
					if (angle_mode == "deg") {
						stack.push(Math.sin(val1 * Math.PI / 180));
					}
					else {
						if (val1 % Math.PI == 0) {
							stack.push(0);
							
						}
						else {
							stack.push(Math.sin(val1));
						}
					}
					
					break;

				case "c":
					if (angle_mode == "deg") {
						stack.push(Math.cos(val1 * Math.PI / 180));
					}
					else {
						if (val1 % (Math.PI / 2) == 0) {
							stack.push(0);
							
						}
						else {
							stack.push(Math.cos(val1));
						}
					}

					break;

				case "t":
					if (angle_mode == "deg") {
						stack.push(Math.tan(val1 * Math.PI / 180));
					}
					else {
						if (val1 % Math.PI == 0) {
							stack.push(0);
							
						}
						else {
							stack.push(Math.tan(val1));
						}
					}

					break;

				case "%":
					stack.push(val2 % val1);
					break;

				case "!":
					stack.push(factorialCalculate(val1));
					break;

				case "n":
					stack.push(Math.log(val1));
					break;

				case "l":
					stack.push(Math.log10(val1));
					break;

				case "d":
					stack.push(val1);

				case "r":
					stack.push(val1 * Math.PI / 180);
				
				case "√":
					stack.push(Math.sqrt(val1));
			}
		}

	}

	return stack;
}

function equals() {
	console.log(Math.sin(Math.PI));
	console.log("display value : ");
	console.log(display.value);
	console.log("configureInFixExp() : ");
	let infixExp = configureInFixExp(display.value);
	console.log(infixExp);

	console.log("infixtoPostFix() : ");
	let postFixExp = infixToPostFix(infixExp);
	console.log(postFixExp);

	console.log("evaluatePostFix() : ")
	result = evaluatePostFix(postFixExp);
	console.log(result);

	inputArea.innerHTML += "<p style=\"text-align:left; margin-left : 5px;\">" + display.value + "</p>";
	inputArea.innerHTML += "<p style=\"text-align:right; margin-right : 5px;\">" + result + "</p>";

	historyTree.push(display.value);
	historyTree.push(result[0].toString());

	currHistoryIndex = historyTree.length;

	display.value = "";
}

function factorialCalculate(x) {
	if (x == 0) {
		return 1;
	}

	return x * factorialCalculate(x - 1);
}


function clear() {
	display.value = "";
}

function backspace() {
	display.value = display.value.substring(0, display.value.length - 1);
}

function multiply() {
	display.value += "*";
}

function divide() {
	display.value += "/";
}

function plusMinus() {
	if (display.value.charAt(0) === "-") {
		display.value = display.value.slice(1);
	} else {
		display.value = "-" + display.value;
	}
}

function factorial() {
	display.value += "!";
}

function pi() {
	display.value += "π";
}

function square() {
	display.value = eval(display.value * display.value);
}

function squareRoot() {
	// display.value = Math.sqrt(display.value);
	display.value += "√(";
}

function percent() {
	let result = display.value / 100;

	updateDisplay(display.value + "%", result);
}

function sin() {

	display.value += "sin ";
}

function cos() {

	display.value += "cos "
}

function tan() {
	display.value += "tan ";
}

function log() {
	display.value += "log "
}

function ln() {
	display.value = "ln "
}

function exponent() {
	display.value += "^";
}

function e() {
	display.value += "e";
}

function radians() {
	radButton.style = "background-color : " + onColor;
	degButton.style = "background-color : " + offColor;
	
	angle_mode = "rad";
}

function degrees() {
	degButton.style = "background-color : " + onColor;
	radButton.style = "background-color : " + offColor;
	
	angle_mode = "deg";
}

function ans() {
	if (result) { display.value = result; }
}

function up() {
	console.log("pressed up arrow key")
	nextHistIndex = currHistoryIndex - 1;

	if (nextHistIndex >= 0) {
		display.value = historyTree[nextHistIndex];
	}

	currHistoryIndex = nextHistIndex;
}

function down() {
	nextHistIndex = currHistoryIndex + 1;

	if (nextHistIndex < historyTree.length) {
		display.value = historyTree[nextHistIndex];
	}

	currHistoryIndex = nextHistIndex;
}

document.addEventListener('keydown', function(event) {
	if (event.keyCode == 13) {
		equals();
	}
})


// IMPORTANT ------------------
// fractions -- needs refactoring, shall leave for later

// ERRORS FOUND ----------------------
// 1. when using %, text align breaks in input area
// 2. when using square  or squareroot it does not display in the history