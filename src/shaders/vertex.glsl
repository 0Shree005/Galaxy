uniform float uTime;
uniform float uSize;
uniform float uSpeed;
uniform int uTrigFunctionX;
uniform int uTrigFunctionZ;

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;

void main()
{
    
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
    // Rotate
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * (uTime * uSpeed);
    angle += angleOffset;

    if (uTrigFunctionX == 0) {
        modelPosition.x = cos(angle) * distanceToCenter;
    } else if (uTrigFunctionX == 1) {
        modelPosition.x = sin(angle) * distanceToCenter;
    } else if (uTrigFunctionX == 2) {
        modelPosition.x = tan(angle) * distanceToCenter;
    } else if (uTrigFunctionX == 3) {
        modelPosition.x = 1.0 / cos(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 4) {
        modelPosition.x = 1.0 / sin(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 5) {
        modelPosition.x = 1.0 / tan(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 6) {
        modelPosition.x = cosh(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 7) {
        modelPosition.x = sinh(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 8) {
        modelPosition.x = tanh(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 9) {
        modelPosition.x = 1.0 / cosh(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 10) {
        modelPosition.x = 1.0 / sinh(angle) * distanceToCenter; 
    } else if (uTrigFunctionX == 11) {
        modelPosition.x = 1.0 / tanh(angle) * distanceToCenter; 
    }

    if (uTrigFunctionZ == 0) {
        modelPosition.z = cos(angle) * distanceToCenter;
    } else if (uTrigFunctionZ == 1) {
        modelPosition.z = sin(angle) * distanceToCenter;
    } else if (uTrigFunctionZ == 2) {
        modelPosition.z = tan(angle) * distanceToCenter;
    } else if (uTrigFunctionZ == 3) {
        modelPosition.z = 1.0 / cos(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 4) {
        modelPosition.z = 1.0 / sin(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 5) {
        modelPosition.z = 1.0 / tan(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 6) {
        modelPosition.z = cosh(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 7) {
        modelPosition.z = sinh(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 8) {
        modelPosition.z = tanh(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 9) {
        modelPosition.z = 1.0 / cosh(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 10) {
        modelPosition.z = 1.0 / sinh(angle) * distanceToCenter; 
    } else if (uTrigFunctionZ == 11) {
        modelPosition.z = 1.0 / tanh(angle) * distanceToCenter; 
    }
    // modelPosition.x = cos(angle) * distanceToCenter;
    // modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    /**
     * Color
     */
    vColor = color;
    
}

