const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = 62

function encodeBase62(num) 
{
    if (num == 0) return BASE62_CHARS[0];

    let encoded = ""

    while(num > 0)
    {
        encoded = BASE62_CHARS[num % BASE] + encoded;
        num = Math.floor(num / BASE);
    }

    return encoded;
}

function decodeBase62(str)
{
    let decoded = 0;

    for (let i = 0; i < str.length; i++) 
    {
        const index = BASE62_CHARS.indexOf(str[i]);

        if (index === -1) throw new Error("Invalid Base62 character");

        decoded = decoded * BASE + index;
    }
    return decoded;
}

export {
    encodeBase62, 
    decodeBase62
}


