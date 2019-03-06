      if ( potentiometerValueA5 >= 764 && potentiometerValueA5 <= 1023 ) // IF the potentiometerValueA5 is between 764 and 1023
      {
        // Send status to Serial Monitor
        Serial.print("Onboard POTENTIOMETER -   Pin A5 (0-1023): ");
        Serial.println(potentiometerValueA5); // Send the value read from Pin 5: 0 to 1023
        Serial.print("Blink LED 14 and 15");
        Serial.println("");
        digitalWrite(14, HIGH);
        digitalWrite(15, HIGH);
        delay(50);
        digitalWrite(14, LOW);
        digitalWrite(15, LOW);
        delay(50);
      }
