"use strict";
var chai = require("chai");
chai.should();

// Initial test for Travis to test
describe("Hello", function() { 
	describe("World", function(){
		it("hello should greet the world", function(){
			var hello = "world";
       		hello.should.equal("world");
    	});
	});
});