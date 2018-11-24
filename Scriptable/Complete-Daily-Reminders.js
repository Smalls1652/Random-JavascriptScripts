/*

Complete Daily Reminders

Created by: Smalls
Website - https://smalls.online
Github - https://github.com/Smalls1652

Description:
Completes every reminder that's due today in a given calendar.

The script is built for the iOS app Scriptable and will only work for that app.

Notes:
Change the variable ReminderList (Located on Line 21) to whatever your desired reminder list is.

*/

// Begin User Variables -->

let ReminderList = "Daily Reminders" //The name of the reminder list

// <-- End User Variables


// Do not edit below unless you know what you're doing

// Begin function declarations -->

function getRemindersCal(list) { //Get the reminder calendar and return it.
	
	return Calendar.forRemindersByTitle(list)
}

function getRemindersForToday(calendar) { //Get the reminders due today and return them.

	return Reminder.incompleteDueToday([calendar])
}

function checkRemindersLength(rlist) { //Checks the reminders list length.

	if (rlist.length == 0) {
		//If Reminders is empty, then break the script and announce it.
		throw new Error("There are no reminders due today to complete in your list " + ReminderList + ".")
	}
}

function completeReminder(reminder){ //Reminders are set to complete and saved.

	reminder.isCompleted = true //Sets the reminder to complete.
	console.log(reminder.title + " has been marked as completed.")
	reminder.save() //Saves the completion to the reminder.
	console.log("Saved!")
}

function handleError(returnedError) { //Handles errors thrown it's way.

	if (config.runsWithSiri) { 
		outputText("Hmm... There seems to be an issue.\n\n" + returnedError.message)
		Script.complete()
	}
	else if (config.runsInApp) {
		outputText("There seems to be an issue.\n\n" + returnedError.message)
		Script.complete()
	}
	else {
		throw returnedError
	}
}

function outputText(text) {  //Choose the proper output option
	
	if (config.runsWithSiri) {
	//If Siri is used to invoke the script.
		Speech.speak(text)
	}
	else if (config.runsInApp) {
	//If it's ran inside of Scriptable.
		outputAlert = new Alert()
		outputAlert.title = "Complete Daily Reminders"
		outputAlert.message = text
		outputAlert.addAction("Okay")
		
		outputAlert.presentAlert()
	}
	
	//Always output text to console for logging purposes.
	console.log(text)
}
	
function completeReminderList() { //Main action function to run the script.

	getRemindersCal(ReminderList) //Get the calendar for the reminder list.
	.then(ReminderCal => getRemindersForToday(ReminderCal)) //Get the reminders due today in the list.
	.then(r => {
		
		checkRemindersLength(r) //Check the length of the reminders returned
		return r
	})
	.then(Reminders => { //Iterate each reminder object and mark as complete. Announce it's completion when done.
		
		Reminders.map(rem => completeReminder(rem))
		
		outputText("Reminders due today, from your list " + ReminderList + ", have been marked complete.")
	})
	.catch(err => handleError(err)) //Any errors are thrown in this catch and reported back through the handleError() function.
	
	Script.complete()
}

// <-- End function declarations

// Begin script actions -->

await completeReminderList() //The main action that runs the script.

// <-- End script actions.