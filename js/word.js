H5P.CrossWord.Word = function (parameters, i) {
	var self = this;
	
	var word = parameters.word_text;
	var clue = parameters.clue;
	var length = word.length;
	var index = i;
	var dir = undefined;
	
	self.getWord = function () {
		return word;
	};
	self.getClue = function () {
		return clue;
	};
	self.getLength = function () {
		return length;
	}
	self.getPos = function () {
		return pos;
	}
	self.getDir = function () {
		return dir;
	}
	self.getIndex = function () {
		return index;
	}
}