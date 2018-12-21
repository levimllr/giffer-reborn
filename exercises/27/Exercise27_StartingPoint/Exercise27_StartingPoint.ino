void setup({
  int ledNumber;
  for (ledNumber = 2; ledNumber <= 15; ledNumber ++) {
    pinMode(ledNumber, OUTPUT);
  }
}

void loop() {
  int count;
  for (count = 1; count <= 4; count++) {
    digitalWrite(2, HIGH);
    digitalWrite(9, HIGH);
    delay(100);
    digitalWrite(2, LOW);
    digitalWrite(9, LOW);
    delay(100);
    digitalWrite(8, HIGH);
    digitalWrite(15, HIGH);
    delay(100);
    digitalWrite(8, LOW);
    digitalWrite(15, LOW);
  }
  delay(4000);
}
