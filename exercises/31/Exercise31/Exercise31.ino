//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1. Make sure that function has been renamed from blink() to blink2Once()
//
//**************ACTIVITES TO CHECK WHILE GRADING**********END*********


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
    blinkTwoOnce();
  }

  delay(4000);
}


void blinkTwoOnce()
{ 
  digitalWrite(2, HIGH);
  delay(100);
  digitalWrite(2, LOW);
  delay(100);
}

