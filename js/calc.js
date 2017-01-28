//using module pattern to avoid goal state
var calculator = (function(){
	var number1='';
	var number2='';
	var currentNumber=1;
	var operator='';
	var operationDone=false;

	//cache DOM elems
	var $buttons = $(".btn");

	$buttons.on('click',_parseInput);
	
	function _displayResult(result){
		$(".display").attr("readonly",false);
		$(".display").val(result);
		$(".display").attr("readonly",true);
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
		_displayResult(result);
		operationDone=true;
	}

	function canSolve(value1,value2,operator){

		return ( operator !== null && !isNaN(value2) && !isNaN(value1));
	}

	function _parseInput(event){
		var elem = $(event.target);
		var value = elem.text();
		
		if(elem.hasClass("operator")){

			var value1 = parseFloat(number1);
			var value2 = parseFloat(number2);
			
			if(value == "%")
			{
				var temp;

				temp = operationDone ? value1 : ((currentNumber == 1) ? value1 : value2);

				if(isNaN(temp))
					return;

				solve(temp,number2,value);
			}
			else if(canSolve(value1,value2,operator))
			{
				solve(value1,value2,operator);
			}
			else if(!operationDone){
				//switch input number only if prev state was 
				//not in solve
				currentNumber= currentNumber == 1 ? 2: 1;	
			}

			//delay assignment to operator to take into account
			//prev calculation
			operator=value;
		}
		if(elem.hasClass("sign")){

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
		else if(elem.hasClass("number") || elem.hasClass("decimal")){
			var temp ;

			temp = currentNumber == 1 ? number1 : number2
			
			if(value != '.' || (value == '.' && temp.indexOf('.') < 0 )){
				temp += value;
			}
			
			_displayResult(temp);

			if(currentNumber==1){
				number1 = temp;
			}else{
				number2 = temp;
			}
		}
		else if(elem.hasClass("answer")){
			
			var value1 = parseFloat(number1);
			var value2 = parseFloat(number2);
			
			if(canSolve(value1,value2,operator)){
				solve(value1,value2,operator);
			}

		}
		else if(elem.hasClass("clear-all")){
			currentNumber=1;
			number1='';
			number2='';
			_displayResult(0);
			operationDone=false;
		}

	}


})();