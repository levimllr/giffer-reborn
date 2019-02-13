//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
//1.	Verify that there are two function definitions and function calls
//a.	 blinkTwoOnce() and blinkThreeOnce
//2.	Verify that LEDs blink in this order 2, 3
//3.	Should repeat 5 times and then pause for 4 seconds
//4.	Verify that parameters are used instead of typing out the numbers
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{ 
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
}


void loop()
{ 
  int x;

  for(x = 1; x <= 5; x++)
  { 
    blinkTwoOnce(200);
    blinkThreeOnce(200);
  }

  delay(4000);
}


void blinkTwoOnce(int t)
{ 
  digitalWrite(2, HIGH);
  delay(t);
  digitalWrite(2, LOW);
  delay(t);
}

void blinkThreeOnce(int t)
{ 
  digitalWrite(3, HIGH);
  delay(t);
  digitalWrite(3, LOW);
  delay(t);
}

