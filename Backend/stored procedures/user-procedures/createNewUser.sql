USE SendIt
GO
CREATE OR ALTER PROCEDURE CreateNewUser(
    @FullName VARCHAR(100),
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255),
    @ProfilePicture VARCHAR(255),
    @Phone VARCHAR(20),
    @Role VARCHAR(10))
AS
BEGIN

INSERT INTO Users (FullName, Email, PasswordHash, ProfilePicture, Phone, Role)
VALUES(@FullName, @Email, @PasswordHash, @ProfilePicture, @Phone, @Role)

END
GO
