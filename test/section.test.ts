import { v4 } from 'uuid'
import { Section } from '../src/models/forms/section'
import { TextField } from '../src/models/forms/fields/implementations/textField'
import { SingleSelectDropdownField } from '../src/models/forms/fields/implementations/singleSelectDropdownField'
import { Dependency } from '../src/models/forms/fields/dependency';

// Test the abstract for field using the TextField class. 
// I'm using this to test all the methods and properties that the children of this class use.
describe('Test the form class.', () => {
    
    test('adding a form field.', () => {

        // Create the form
        let form: Section = new Section(v4())

        // Create a text field and add it
        let tfId = v4()
        let tf: TextField = new TextField(tfId, "Test!", true)

        // Add the field to the form
        form.createField(tf)

        // Now verify that the field exists
        expect(form.fields.get(tfId)).toEqual(tf)

        // We also expect the form to be valid
        expect(form.isValid()).toBeTruthy()
    });

    test('invalid form field makes form invalid.', () => {

        // Create the form
        let form: Section = new Section(v4())

        // Create a text field and add it
        let tfId = v4()
        let tf: TextField = new TextField(tfId, null, true)

        // Add the field to the form
        form.createField(tf)

        // Now verify that the field exists
        expect(form.fields.get(tfId)).toEqual(tf)

        // We also expect the form to be valid
        expect(form.isValid()).toBeFalsy()
    });

    test('dependency makes field invisible.', () => {

        // Create the form
        let form: Section = new Section(v4())

        // Create a text field and add it
        let tfId = v4()
        let tf: TextField = new TextField(tfId, "Test!", true)

        // Add the field to the form
        form.createField(tf)

        // Now verify that the field is visible
        expect(form.fields.get(tfId)?.visible).toBeTruthy()

        // Now add a single select field
        let ssdId = v4()
        let ssdf = new SingleSelectDropdownField(ssdId, "opt1", true, ["opt1", "opt2"])
        form.createField(ssdf)

        // Create a dependency that should hide the text field
        form.createDependency(new Dependency<string>(v4(), tfId, ssdId, "opt2"))

        // Validate that the text field is invisible
        expect(form.fields.get(tfId)?.visible).toBeFalsy()
    });

    test('deleting dependency makes field visible.', () => {

        // Create the form
        let form: Section = new Section(v4())

        // Create a text field and add it
        let tfId = v4()
        let tf: TextField = new TextField(tfId, "Test!", true)

        // Add the field to the form
        form.createField(tf)

        // Now verify that the field is visible
        expect(form.fields.get(tfId)?.visible).toBeTruthy()

        // Now add a single select field
        let ssdId = v4()
        let ssdf = new SingleSelectDropdownField(ssdId, "opt1", true, ["opt1", "opt2"])
        form.createField(ssdf)

        // Create a dependency that should hide the text field
        let dep: Dependency<string> = new Dependency<string>(v4(), tfId, ssdId, "opt2")
        form.createDependency(dep)

        // Validate that the text field is invisible
        expect(form.fields.get(tfId)?.visible).toBeFalsy()

        // Next, delete the dependency
        form.deleteDependency(dep)

        // Validate that the text form is visible
        expect(form.fields.get(tfId)?.visible).toBeTruthy()
    });
});