import Ajv, { ValidateFunction } from 'ajv';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { VALIDATION_SCHEMAS, ToolName } from './schemas.js';

/**
 * Validation error that includes helpful error messages
 */
export class ValidationError extends Error {
  constructor(
    public readonly field: string,
    public readonly message: string,
    public readonly value: unknown
  ) {
    super(`Validation failed for field '${field}': ${message}`);
    this.name = 'ValidationError';
  }
}

/**
 * Input validator for MCP tool arguments
 */
export class InputValidator {
  private readonly ajv: Ajv;
  private readonly validators: Map<ToolName, ValidateFunction> = new Map();

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
      removeAdditional: true, // Remove additional properties not in schema
    });

    // Pre-compile all validators for better performance
    this.compileValidators();
  }

  /**
   * Pre-compile all validation schemas for better performance
   */
  private compileValidators(): void {
    for (const [toolName, schema] of Object.entries(VALIDATION_SCHEMAS)) {
      try {
        const validator = this.ajv.compile(schema);
        this.validators.set(toolName as ToolName, validator);
      } catch (error) {
        throw new Error(`Failed to compile validator for ${toolName}: ${error}`);
      }
    }
  }

  /**
   * Validate arguments for a specific MCP tool
   * @param toolName - Name of the MCP tool
   * @param args - Arguments to validate
   * @returns Validated and sanitized arguments
   * @throws ValidationError if validation fails
   */
  public validateToolArguments<T = any>(toolName: ToolName, args: unknown): T {
    const validator = this.validators.get(toolName);
    if (!validator) {
      throw new ValidationError('tool', `Unknown tool: ${toolName}`, toolName);
    }

    // Ensure args is an object
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw new ValidationError('args', 'Arguments must be a non-null object', args);
    }

    // Validate against schema
    const isValid = validator(args);
    if (!isValid) {
      const errors = validator.errors || [];
      const firstError = errors[0];
      
      if (firstError) {
        const fieldPath = firstError.instancePath || firstError.schemaPath || 'unknown';
        const fieldName = fieldPath.replace(/^\//, '') || firstError.keyword || 'unknown';
        let message = firstError.message || 'Invalid value';
        
        // Enhance error messages for better user experience
        if (firstError.keyword === 'required') {
          message = `Missing required field: ${firstError.params?.missingProperty || 'unknown'}`;
        } else if (firstError.keyword === 'minLength') {
          message = `Must be at least ${firstError.params?.limit || 1} characters long`;
        } else if (firstError.keyword === 'type') {
          message = `Must be of type ${firstError.params?.type || 'unknown'}`;
        } else if (firstError.keyword === 'enum') {
          message = `Must be one of: ${firstError.params?.allowedValues?.join(', ') || 'allowed values'}`;
        } else if (firstError.keyword === 'minimum') {
          message = `Must be at least ${firstError.params?.limit || 0}`;
        } else if (firstError.keyword === 'maximum') {
          message = `Must be at most ${firstError.params?.limit || 100}`;
        }
        
        throw new ValidationError(fieldName, message, firstError.data);
      } else {
        throw new ValidationError('unknown', 'Validation failed', args);
      }
    }

    // Return validated and sanitized arguments
    return args as T;
  }

  /**
   * Convert ValidationError to MCP error format
   * @param error - ValidationError instance
   * @returns McpError with appropriate error code and message
   */
  public static toMcpError(error: ValidationError): McpError {
    return {
      code: ErrorCode.InvalidRequest,
      message: `Input validation failed: ${error.message}`,
      name: 'ValidationError',
      data: {
        field: error.field,
        value: error.value
      }
    };
  }

  /**
   * Validate arguments and return MCP error if validation fails
   * @param toolName - Name of the MCP tool
   * @param args - Arguments to validate
   * @returns Validated arguments or throws McpError
   */
  public validateOrThrowMcpError<T = any>(toolName: ToolName, args: unknown): T {
    try {
      return this.validateToolArguments<T>(toolName, args);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw InputValidator.toMcpError(error);
      }
      // Re-throw non-validation errors
      throw error;
    }
  }
}

// Export singleton instance for use across the application
export const inputValidator = new InputValidator();