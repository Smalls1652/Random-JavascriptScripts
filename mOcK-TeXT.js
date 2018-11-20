/*

mOcK-TeXT

Created by: Smalls
Website - https://smalls.online
Github - https://github.com/Smalls1652

Description:
Know that Spongebob meme where he looks like a chicken and the text is in a mocking tone? This converts text to that format.

The script is built for the iOS app Scriptable and will only work for that app; however, the main function that converts the text is mOcKTeXt() and can be utilized anywhere. The copyText() function in it will need to be changed to whatever you want it to be.

*/
	
function copyText(s) {
	//This function is iOS specific for the app Scriptable.
	Pasteboard.copyString(s.mockText) //Copies the mocked text to the clipboard.
}

function mOcKTeXt(z) {
	//Converts the text into a mocking tone.
	
	if (z) { //If text is even passed through.
	
		let inputText = z.toLowerCase(); //Convert the text to lowercase for better results.
		
		let charUpRate = Math.round((inputText.length / (inputText.length / 0.7))); //The uppercase interval
	
		let i = 0;
		let returnText = "";
		
		//Running map on the split text.
		inputText.split("").map( c => {
			if (i == charUpRate) { //When the counter hits the uppercase interval, it converts the char to uppercase
				returnText += c.toUpperCase();
				i = 0;
			}
			else { //Otherwise it just returns the char and increases the counter.
				returnText += c;
				i++;
			}
		});
		
		copyText( { 
			regularText: z,
			mockText: returnText
			}); //Calling on copyText with both the regular and the mock text passed as an object.
		
		exitAlert(); //Exit script alert
	}
}

function exitAlert() {
	
	//Currently broken, but still exits script.
	
	let CopiedAlert = new Alert(); //CopiedAlert is iOS specific for the app Scriptable.

	CopiedAlert.message = "Text has been copied to the clipboard.";
	CopiedAlert.title = "mOcK ScRIpT";
	CopiedAlert.addAction("Ok");
	
	CopiedAlert.presentSheet();
	
	Script.complete();
}

//Start of script ->

if (args.plainTexts[0]) { //If data is passed through a share sheet.

	mOcKTeXt(args.plainTexts[0]);

}
else { //Otherwise a prompt is shown.

	let alertBox = new Alert(); //AlertBox is iOS specific for the app Scriptable.
	alertBox.message = "What text would you like to mock?";
	alertBox.title = "mOcK ScRIpT";
	alertBox.addAction("Done");
	alertBox.addTextField("Enter mock text here...", "")
	
	alertBox.present().then( z =>  { 
		mOcKTeXt(alertBox.textFieldValue(z))
	});

}

//<- End of script