import { Rulesets } from "../cfg-code-generator/cfg-rules.js";
import { CFGRuleset } from "../cfg-code-generator/cfg-generator.js";

const mathRules = CFGRuleset.fromJSON(Rulesets.addSubMath);
const starter = [
    {
        content: "expr",
        isString: false
    }
]
const QUESTION_COUNT = 7;

function game() {

	let q = 0;
	let exprElem = document.getElementById("expression");
    let inputElem = document.getElementById("answer");
    let submitElem = document.getElementById("submit");
    let feedbackElem = document.getElementById("feedback");
    let completedCountElem = document.getElementById("completed-count");
    let nextElem = document.getElementById("next");
    nextElem.style.display = "none";
    let exprText;
    let exprResult;

	let submitHandler = () => {
        	if (parseInt(inputElem.value) == exprResult) {
            	feedbackElem.innerText = "Correct!";
                completedCountElem.innerText = `${q}/${QUESTION_COUNT} Completed`;		 
                nextElem.style.display = "block";
            } else {
            	feedbackElem.innerText = "Try again.";
            }
        }
        
     submitElem.addEventListener("click", submitHandler);
        
    let nextHandler = () => {
            nextElem.style.display = "none";
            inputElem.value = "";
            feedbackElem.innerText = "";
            if (q >= QUESTION_COUNT) {
                done();
            } else {
        	    iteration();
            }
        };
        
    nextElem.addEventListener("click", nextHandler);
        
	function iteration() {
    	q += 1;
    	exprText = mathRules.makeString(starter, 10, q * 2) + ";";
        exprResult = eval(exprText);
        
        exprElem.innerText = exprText;
    }

    function done() {
        document.getElementById("complete").style.display = "block";
        document.getElementById("in-progress").style.display = "none";
    }
    
    iteration();

}

game();