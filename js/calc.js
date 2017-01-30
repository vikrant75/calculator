//using module pattern to avoid goal state
var calculator = (function(){
	var number1='';
	var number2='';
	var currentNumber=1;
	var operator='';
	var operationDone=false;

	var calObject = {
		type : null,
		value : null,

		init: function (type,value){
			this.type = type;
			this.value = value;
		},

		isValid: function(){

			return (this.type != null && this.value != null);
		}
	};

	//cache DOM elems
	var $buttons = $(".btn");
	var $display = $(".display");

	$buttons.on('click',parseInput);
	
	function _displayResult(result){
		$display.attr("readonly",false);
		$display.val(result);
		$display.attr("readonly",true);
	}

	function solve(value1,value2,operator){

		var result='';
		switch (operator)
		{
			case "+":
				result = value1 + value2;
				break;
			case "-":
				result = value1 - value2;
				break;
			case "x":
				result = value1 * value2;
				break;
			case "/":
				if(value2 == 0 )
					result="ERROR";
				else
					result = value1 / value2;
				break;
			case "%":
				result = value1/100;
				break;
		}
		currentNumber=2;
		number1 = result == "ERROR" ? value1 : result;
		number2 = '';
		operationDone=true;
		return result;
	}

	function _canSolve(value1,value2,operator){

		return ( operator !== null && !isNaN(value2) && !isNaN(value1));
	}

	function _getCalObject(elem){
		if(elem === null)
			return calObject;

		var resultObject = calObject;
		resultObject.value = elem.text();

		if(elem.hasClass("operator")){
			resultObject.type = "operator";
		}
		else if (elem.hasClass("sign")){
			resultObject.type ="sign";
		}
		else if (elem.hasClass("number") || elem.hasClass("decimal")){
			resultObject.type = "inputNumber";
		}
		else if(elem.hasClass("answer")){
			resultObject.type = "evaluate";
		}
		else if(elem.hasClass("clear-all")){
			resultObject.type = "clear-all"
		}

		return resultObject;
	}

	function _stateOperator(oper){

		var value1 = parseFloat(number1);
		var value2 = parseFloat(number2);
			
		if(oper == "%")
		{
			var temp;
			temp = operationDone ? value1 : ((currentNumber == 1) ? value1 : value2);

			if(isNaN(temp))
				return;

			var res = solve(temp,number2,oper);
			_displayResult(res);
		}
		else if(_canSolve(value1,value2,operator))
		{
			var res = solve(value1,value2,operator);
			_displayResult(res);
		}
		else if(!operationDone){
		 	//switch input number only if prev state was 
			//not in solve
			currentNumber= currentNumber == 1 ? 2: 1;	
		}

		//delay assignment to operator to take into account
		//prev calculation
		operator=oper;
	}

	function _stateSign(){
		var temp;
		temp = operationDone ? number1 : (currentNumber == 1 ? number1 : number2);
		
		if(isNaN(parseFloat(temp)))
			return;

        temp = (parseFloat(temp)*(-1)).toString();
        _displayResult(temp);

        if(operationDone || currentNumber == 1)
        	number1 = temp;
        else
        	number2 = temp;	
	}

	function _stateInputNumber(num_val){
		var temp ;
		temp = currentNumber == 1 ? number1 : number2
			
		if(num_val != '.' || (num_val == '.' && temp.indexOf('.') < 0 )){

				temp += num_val;
			}
			
		_displayResult(temp);

		if(currentNumber==1){
			number1 = temp;
		}else{
			number2 = temp;
			}
	}

	function _stateEvaluate(){
		var value1 = parseFloat(number1);
		var value2 = parseFloat(number2);
		
		if(_canSolve(value1,value2,operator)){
			var res = solve(value1,value2,operator);
			_displayResult(res);
		}
	}

	function getInputNumber(index){

		var temp =  index == 1 ? number1 : number2;
		return parseFloat(temp);
	}

	function getOperator(){
		return operator;
	}

	function _stateClearAll(){
		currentNumber=1;
		number1='';
		number2='';
		_displayResult(0);
		operationDone=false;
	}

	function parseInput(event,calObject){

		var inputObject = event != null ? $(event.target) : calObject;

		if(event != null)
			inputObject = _getCalObject(inputObject);

		if(!inputObject.isValid()){

			console.log(calObject, "input object is not a valid cal objet");
			return;
		}

		switch(inputObject.type){
			case "operator":
					_stateOperator(inputObject.value);
					break;
			case "sign":
					_stateSign();
					break;
			case "inputNumber":
					_stateInputNumber(inputObject.value);
					break;
			case "evaluate":
					_stateEvaluate();
					break;
			case "clear-all":
					_stateClearAll();
					break;
		}

	}

	return {
		parseInput:parseInput,
		getInputNumber:getInputNumber,
		getOperator:getOperator,
		solve:solve,
		calObject:calObject
	};
})();