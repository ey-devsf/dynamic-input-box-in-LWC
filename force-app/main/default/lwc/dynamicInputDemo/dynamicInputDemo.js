import { LightningElement } from 'lwc';

export default class DynamicInputDemo extends LightningElement {
    // Values for each input type
    textValue = '';
    numberValue = '';
    dateValue = '';
    dateTimeValue = '';
    picklistValue = '';
    booleanValue = '';

    // Validation status for each input type
    textValidation = '';
    numberValidation = '';
    dateValidation = '';
    dateTimeValidation = '';
    picklistValidation = '';
    booleanValidation = '';

    // Error messages array
    errorMessages = [];

    // Picklist options
    picklistOptions = [
        { label: 'オプション1', value: 'option1' },
        { label: 'オプション2', value: 'option2' },
        { label: 'オプション3', value: 'option3' },
        { label: 'オプション4', value: 'option4' }
    ];

    // Default boolean value
    booleanDefaultValue = true;

    get hasErrors() {
        return this.errorMessages.length > 0;
    }

    handleValueChange(event) {
        const { value, isValid, errorMessage } = event.detail;
        const targetLabel = event.target.label;

        // Update corresponding value and validation status
        switch (targetLabel) {
            case 'テキスト入力':
                this.textValue = value;
                this.textValidation = isValid ? '✓ 有効' : `✗ ${errorMessage}`;
                break;
            case '数値入力':
                this.numberValue = value;
                this.numberValidation = isValid ? '✓ 有効' : `✗ ${errorMessage}`;
                break;
            case '日付入力':
                this.dateValue = value;
                this.dateValidation = isValid ? '✓ 有効' : `✗ ${errorMessage}`;
                break;
            case '日時入力':
                this.dateTimeValue = value;
                this.dateTimeValidation = isValid ? '✓ 有効' : `✗ ${errorMessage}`;
                break;
            case '選択リスト':
                this.picklistValue = value;
                this.picklistValidation = isValid ? '✓ 有効' : `✗ ${errorMessage}`;
                break;
            case 'チェックボックス':
                this.booleanValue = value ? 'true' : 'false';
                this.booleanValidation = '✓ 有効';
                break;
            default:
                break;
        }

        console.log('Value changed:', {
            label: targetLabel,
            value,
            isValid,
            errorMessage
        });
    }

    handleError(event) {
        const { message } = event.detail;
        const errorId = Date.now();
        
        this.errorMessages = [
            ...this.errorMessages,
            { id: errorId, message: `[${new Date().toLocaleTimeString()}] ${message}` }
        ];

        console.error('Validation error:', message);
    }
}
