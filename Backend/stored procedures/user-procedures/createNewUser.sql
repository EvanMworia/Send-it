USE SENDITDB
GO
CREATE OR ALTER PROCEDURE CreateNewUser(
    @UserID VARCHAR(255),
    @FullName VARCHAR(100),
    @Email VARCHAR(255),
    @Password VARCHAR(255),
    @ProfilePicture VARCHAR(255),
    @Phone VARCHAR(20),
    @Role VARCHAR(10))
AS
BEGIN

INSERT INTO Users (UserID, FullName, Email, Password, ProfilePicture, Phone, Role)
VALUES(@UserID, @FullName, @Email, @Password, @ProfilePicture, @Phone, @Role)

END
GO
