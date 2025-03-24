import jwt from 'jsonwebtoken'; 

// Function to generate JWT token and set it as a cookie
const generateTokenAndSetCookie = ((userId, res) => {
    
    // Generate a JSON Web Token (JWT) with userId as payload
    const token = jwt.sign(
        { userId }, //Payload: { userId } → Stores the user’s ID inside the token.
        process.env.JWT_SECRET, // Secret key for signing the token (must be stored securely in .env file)
        {
            expiresIn: '15d' // Token will expire in 15 days
        }
    );

    // Set the generated token as a cookie in the response
    res.cookie("jwt", token, {
        httpOnly: true,  // Prevents client-side JavaScript access (helps against XSS attacks)
        maxAge: 15 * 24 * 60 * 60 * 1000, // Expiry time: 15 days in milliseconds
        sameSite: "None" ,
        secure : true 
    });

    return token;
});

export default generateTokenAndSetCookie;
