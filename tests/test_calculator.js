function clearCalculator(){
	var calObject =  calculator.calObject;

	calObject.init("clear-all","AC");
	calculator.parseInput(null,calObject);
}

function setInput(calObject,assert,expectedValue1,expectedValue2){

	calculator.parseInput(null,calObject);

	switch(calObject.type){
		case "operator":
			assert.equal(calculator.getOperator(), calObject.value, "" );
			break;
		case "inputNumber":
		    if(isNaN(parseFloat(expectedValue2)) && isNaN(parseFloat(expectedValue1))){
		    	assert.ok(isNaN(calculator.getInputNumber(1)), "" );
		    	assert.ok(isNaN(calculator.getInputNumber(2)), "" );
		    }
            if(isNaN(parseFloat(expectedValue1))){
            	assert.ok(isNaN(calculator.getInputNumber(1)), "" );
            	assert.equal(calculator.getInputNumber(2), expectedValue2, "" );
            }
            else if(isNaN(parseFloat(expectedValue2))){
            	assert.equal(calculator.getInputNumber(1), expectedValue1, "" );
            	assert.ok(isNaN(calculator.getInputNumber(2)), "" );            	
            }
            else{
            	assert.equal(calculator.getInputNumber(1), expectedValue1, "" );
            	assert.equal(calculator.getInputNumber(2), expectedValue2, "" );
            }
            break;

         case "evaluate":
         		assert.equal(calculator.getInputNumber(1), expectedValue1, "" );	
				assert.ok(isNaN(calculator.getInputNumber(2)), "" );
			break;
        }
}

QUnit.module( "module calculator", {
  
  beforeEach: function() {
    // prepare something before each test
    clearCalculator();
    console.assert (isNaN(calculator.getInputNumber(1)));	
	console.assert (isNaN(calculator.getInputNumber(2)));
  },
});

QUnit.test( "Test function: solve", function( assert ) {

	assert.equal(calculator.solve(1,2,"+"), 3, "test addition" );
	assert.equal(calculator.solve(4,2,"x"), 8, "test multiplication" );
	assert.equal(calculator.solve(1213,21313,"-"), -20100, "test subtraction" );
	assert.equal(calculator.solve(34,0,"/"), "ERROR", "test division" );
	assert.equal(calculator.solve(3400,0,"%"), 34, "test percent" );
  });

QUnit.test( "test seq +,-,=,*", function( assert ) {

	var calObject =  calculator.calObject;

	//set input1
	calObject.init("inputNumber","10");
	setInput(calObject,assert,10,NaN);

    //set operator
	calObject.init("operator","+");
	setInput(calObject,assert,NaN,NaN);

	//set input2
	calObject.init("inputNumber","10");
	setInput(calObject,assert,10,10);

	calObject.init("evaluate","=");
	setInput(calObject,assert,20,NaN);

    calObject.init("operator","-");
    setInput(calObject,assert,20,NaN);

	calObject.init("inputNumber","5");
	setInput(calObject,assert,20,5);

	calObject.init("operator","x");
	setInput(calObject,assert,NaN,NaN);
	assert.equal(calculator.getInputNumber(1), 15, "" );
    assert.ok(isNaN(calculator.getInputNumber(2)), "" );

  });
