QUnit.module( "calculator");

QUnit.test( "Test function: solve", function( assert ) {

	assert.equal(calculator.solve(1,2,"+"), 3, "test addition" );
	assert.equal(calculator.solve(4,2,"x"), 8, "test multiplication" );
	assert.equal(calculator.solve(1213,21313,"-"), -20100, "test subtraction" );
	assert.equal(calculator.solve(34,0,"/"), "ERROR", "test division" );
	assert.equal(calculator.solve(3400,0,"%"), 34, "test percent" );
  });