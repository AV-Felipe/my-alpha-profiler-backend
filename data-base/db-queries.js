module.exports = {

    getUserFullData: 'SELECT * FROM users WHERE email = $1 AND active = TRUE;',

    insertNewUser: `
    INSERT INTO users (username, password, email, birthdate)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
    `,

    listAllUsers: 'SELECT id, username, email, birthdate FROM users WHERE active = TRUE;',

    getUserIdByUserName: `SELECT id FROM users where username = $1;`,

    deleteUserById: `
    UPDATE users
    SET deleted_at = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')), active = false
    WHERE id = $1
    RETURNING id, to_timestamp(deleted_at) AS deleted_at;
    `,

    getUserById: `SELECT username, email, birthdate, user_image FROM users WHERE id = $1 AND active = TRUE;`,

    updateData(body, userId){

        let setString = `SET updated_at = now()`;
        let counter = 2;
        let desiredValues = [userId]


        for (const key in body){
            setString += `, ${key} = $${counter}`;
            counter++;
            desiredValues.push(body[key]);
        }

        return {
            queryString: `
            UPDATE users
            ${setString}
            WHERE id = $1
            RETURNING id, username, email, birthdate, user_image;
            `,

            values: desiredValues,
        }
    }
}