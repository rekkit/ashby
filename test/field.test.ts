import { TextField } from '../src/models/forms/fields/implementations/textField'
import { v4 } from 'uuid'

// Test the abstract for field using the TextField class. 
// I'm using this to test all the methods and properties that the children of this class use.
describe('Test abstract form field using the TextField class.', () => {
    
    test('required fields.', () => {

        // Set the value to null and expect the field to be invalid because it's required.
        let tf: TextField = new TextField(v4(), null, true)
        expect(tf.isValid()).toBeFalsy()

        // Set required to false which should make the field valid.
        tf.required = false
        expect(tf.isValid()).toBeTruthy()
    });

});