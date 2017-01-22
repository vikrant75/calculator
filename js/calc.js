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
		var value = $(event.target).text();

		if($(event.target).hasClass("operator")){

			var value1 = parseFloat(number1);
			var value2 = parseFloat(number2);
			
			if(canSolve(value1,value2,operator))
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
		else if($(event.target).hasClass("number") || 
				$(event.target).hasClass("decimal")){
			
			if(currentNumber==1){
				if(value != '.' || (value == '.' && number1.indexOf('.') < 0 ) )
					number1 += value;
				_displayResult(number1);
			}else{

				if(value != '.' || (value == '.'&& number2.indexOf('.') < 0) )
					number2 += value;
				_displayResult(number2);
			}
		}
		else if($(event.target).hasClass("answer")){
			
			var value1 = parseFloat(number1);
			var value2 = parseFloat(number2);
			
			if(canSolve(value1,value2,operator)){
				solve(value1,value2,operator);
			}

		}
		else if($(event.target).hasClass("clear-all")){
			currentNumber=1;
			number1='';
			number2='';
			_displayResult(0);
			operationDone=false;
		}

	}


})();