import { BooleanField } from '../src/models/forms/fields/implementations/booleanField'
import { v4 } from 'uuid'

describe('Test the boolean form field.', () => {
    
    test('the BooleanField isValid() method.', () => {

        // Make sure that the field is valid when 'true' is selected.
        let bf: BooleanField = new BooleanField(v4(), true, true)
        expect(bf.isValid()).toBeTruthy()

        // Same thing for 'false'.
        bf.value = false
        expect(bf.isValid()).toBeTruthy()
    });

});