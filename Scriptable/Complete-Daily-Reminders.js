/*

Complete Daily Reminders

Created by: Smalls
Website - https://smalls.online
Github - https://github.com/Smalls1652

Description:
Completes every reminder that's due today in a given calendar.

The script is built for the iOS app Scriptable and will only work for that app.

Notes:
Change the variable ReminderList (Located on Line 19) to whatever your desired reminder list is.

*/

let ReminderList = "Morning Reminders"; //The name of the reminder list

// Do not edit below unless you know what you're doing

function getRemindersCal(list) {
	//Get the reminder calendar and return it.
	
	return Calendar.forRemindersByTitle(list);
}

function getRemindersForToday(calendar) {
	//Get the reminders due today and return them.

	return 	Reminder.incompleteDueToday([calendar]);
}

function checkRemindersLength(rlist) { 
	//Checks the reminders list length.

	if (rlist.length == 0) {
		//If Reminders is empty, then break the script and announce it.
		throw new Error("There are no reminders due today to complete in your list " + ReminderList + ".");
	}
}

function completeReminder(reminder){ 
	//Reminders are set to complete and saved.

	reminder.isCompleted = true; //Sets the reminder to complete.
	console.log(reminder.title + " has been marked as completed.");
	reminder.save(); //Saves the completion to the reminder.
	console.log("Saved!");
}

function handleError(returnedError) { 
	//Handles errors thrown it's way.

	if (config.runsWithSiri) {
		outputText("Hmm... There seems to be an issue.\n\n" + returnedError.message);
		
		let ErrorTable = new UITable();
		ErrorTable.showSeparators = true;
		
		let ErrorTableHeader = new UITableRow();
		ErrorTableHeader.isHeader = true;
		ErrorTableHeader.addCell(UITableCell.text("There seems to have been an issue."))
		
		let ErrorTableInfo = new UITableRow();
		ErrorTableInfo.height = 120;
		ErrorTableInfo.addCell(UITableCell.text(returnedError.message))
		
		ErrorTable.addRow(ErrorTableHeader);
		ErrorTable.addRow(ErrorTableInfo);
		
		ErrorTable.present();
	}
	else if (config.runsInApp) {
		outputText("There seems to be an issue.\n\n" + returnedError.message);
	}
	else {
		throw returnedError;
	}
}

function outputText(text) {  
	//Choose the proper output option
	//Always output text to console for logging purposes.
	console.log(text);
	
	if (config.runsWithSiri) {
		//If Siri is used to invoke the script.
		Speech.speak(text);
	}
	else {
		//If anything else, present an alert.
		let ScriptAlert = new Alert();
		ScriptAlert.title = Script.name();
		ScriptAlert.message = text;
		
		ScriptAlert.presentAlert();
	}
}
	
async function completeReminderList() { 

	//Main action function to run the script.

	await getRemindersCal(ReminderList) //Get the calendar for the reminder list.
	.then(ReminderCal => getRemindersForToday(ReminderCal)) //Get the reminders due today in the list.
	.then(r => {
		
		checkRemindersLength(r); //Check the length of the reminders returned
		return r;
	})
	.then(Reminders => { 
	
		//Iterate each reminder object and mark as complete. Announce it's completion when done.
		
		Reminders.map(rem => completeReminder(rem));
		
		//Build the table to show.
		let ReminderTable = new UITable();
		
		//Table Header
		let TableHeader = new UITableRow();
		
		let TableHeaderTitleCell = UITableCell.text("Title");
		TableHeaderTitleCell.leftAligned();
		TableHeaderTitleCell.widthWeight = 50;
		
		let TableHeaderCompletedCell = UITableCell.text("Completed");
		TableHeaderCompletedCell.centerAligned();
		TableHeaderCompletedCell.widthWeight = 35;
		
		TableHeader.addCell(TableHeaderTitleCell);
		TableHeader.addCell(TableHeaderCompletedCell);
		TableHeader.isHeader = true;
		
		ReminderTable.addRow(TableHeader);
		
		//Add each reminder completed to the table
		Reminders.map(rem => {
			let row = new UITableRow();
			
			let rowTitleCell = UITableCell.text(rem.title);
			rowTitleCell.leftAligned();
			rowTitleCell.widthWeight = 50;
			
			let rowCompletedCell = UITableCell.text("☑️");
			rowCompletedCell.centerAligned();
			rowCompletedCell.widthWeight = 35;
			
			
			row.addCell(rowTitleCell);
			row.addCell(rowCompletedCell);
			ReminderTable.addRow(row);
		});
		
		ReminderTable.showSeparators = true;
		
		ReminderTable.present();
		
		outputText("\nReminders, in " + ReminderList + ", have been marked complete.");
	})
	.catch(err => handleError(err)); //Any errors are thrown in this catch and reported back through the handleError() function.
}

await completeReminderList(); //The main action that runs the script.