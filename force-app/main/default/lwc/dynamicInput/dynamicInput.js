import { LightningElement, api } from 'lwc';

export default class DynamicInput extends LightningElement {
    // API Properties
    @api dataType;
    @api maxLength;
    @api precision;
    @api scale;
    @api picklistOptions = [];
    @api defaultValue;
    @api label;

    // Internal state
    currentValue;
    errorMessage = '';

    // Initialize component
    connectedCallback() {
        this.currentValue = this.defaultValue || '';
        this.validateValue(this.currentValue);
    }

    // Computed properties for conditional rendering
    get isText() {
        return this.dataType === 'Text';
    }

    get isNumber() {
        return this.dataType === 'Number';
    }

    get isDate() {
        return this.dataType === 'Date';
    }

    get isDateTime() {
        return this.dataType === 'DateTime';
    }

    get isPicklist() {
        return this.dataType === 'Picklist';
    }

    get isBoolean() {
        return this.dataType === 'Boolean';
    }

    // Handle value change
    handleChange(event) {
        const target = event.target;
        let newValue;

        if (this.isBoolean) {
            newValue = target.checked;
        } else {
            newValue = target.value;
        }

        this.currentValue = newValue;
        const validationResult = this.validateValue(newValue);

        // Dispatch valuechange event
        const valueChangeEvent = new CustomEvent('valuechange', {
            detail: {
                value: newValue,
                isValid: validationResult.isValid,
                errorMessage: validationResult.errorMessage
            }
        });
        this.dispatchEvent(valueChangeEvent);

        // Dispatch error event if invalid
        if (!validationResult.isValid) {
            const errorEvent = new CustomEvent('error', {
                detail: {
                    message: validationResult.errorMessage
                }
            });
            this.dispatchEvent(errorEvent);
        }
    }

    // Validation logic
    validateValue(value) {
        let isValid = true;
        let errorMessage = '';

        try {
            switch (this.dataType) {
                case 'Text':
                    if (this.maxLength && value && value.length > this.maxLength) {
                        isValid = false;
                        errorMessage = `最大文字数は ${this.maxLength} 文字です`;
                    }
                    break;

                case 'Number':
                    if (value !== null && value !== undefined && value !== '') {
                        const numValue = parseFloat(value);
                        if (isNaN(numValue)) {
                            isValid = false;
                            errorMessage = '数値を入力してください';
                        } else {
                            // Check precision (total digits) and scale (decimal places)
                            const valueStr = String(numValue);
                            const parts = valueStr.split('.');
                            const integerPart = parts[0].replace('-', '');
                            const decimalPart = parts[1] || '';

                            if (this.precision && integerPart.length > this.precision) {
                                isValid = false;
                                errorMessage = `整数部は ${this.precision} 桁以内で入力してください`;
                            }

                            if (this.scale !== undefined && this.scale !== null && decimalPart.length > this.scale) {
                                isValid = false;
                                errorMessage = `小数部は ${this.scale} 桁以内で入力してください`;
                            }
                        }
                    }
                    break;

                case 'Date':
                    if (value && !this.isValidDate(value)) {
                        isValid = false;
                        errorMessage = '有効な日付を入力してください';
                    }
                    break;

                case 'DateTime':
                    if (value && !this.isValidDateTime(value)) {
                        isValid = false;
                        errorMessage = '有効な日時を入力してください';
                    }
                    break;

                case 'Picklist':
                    if (!value || value === '') {
                        isValid = false;
                        errorMessage = '選択肢を選んでください';
                    }
                    break;

                case 'Boolean':
                    // Boolean is always valid (true or false)
                    break;

                default:
                    break;
            }
        } catch (error) {
            isValid = false;
            errorMessage = 'バリデーションエラーが発生しました';
        }

        this.errorMessage = errorMessage;
        return { isValid, errorMessage };
    }

    // Helper method to validate date format
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Helper method to validate datetime format
    isValidDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date instanceof Date && !isNaN(date);
    }

    // Public method to get current value
    @api
    getValue() {
        return this.currentValue;
    }

    // Public method to check if value is valid
    @api
    isValid() {
        return this.validateValue(this.currentValue).isValid;
    }

    // Public method to reset the field
    @api
    reset() {
        this.currentValue = this.defaultValue || '';
        this.errorMessage = '';
    }
}
