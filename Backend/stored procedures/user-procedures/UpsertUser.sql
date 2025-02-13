USE SENDITDB
GO
CREATE OR ALTER  PROCEDURE UpsertUser( 
    @UserID VARCHAR(255),
    @FullName VARCHAR(100),
    @Email VARCHAR(255),
    @Password VARCHAR(255),
    @ProfilePicture VARCHAR(255),
    @Phone VARCHAR(20),
    @Role VARCHAR(10))
AS
BEGIN
	IF EXISTS(SELECT 1 FROM Users WHERE UserID=@UserID)
	BEGIN 
	UPDATE Users
	SET FullName = @FullName, Email = @Email, Password = @Password, ProfilePicture = @ProfilePicture, Phone = @Phone, Role = @Role
	WHERE UserID=@UserID
	END
	ELSE
	BEGIN
	INSERT INTO Users (UserID, FullName, Email, Password, ProfilePicture, Phone, Role)
VALUES(@UserID, @FullName, @Email, @Password, @ProfilePicture, @Phone, @Role)
	END
 
END