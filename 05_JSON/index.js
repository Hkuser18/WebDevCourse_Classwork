let userObj = {
    username: "hkuser",
    grade: 99,
    password: "pass123",
    isConnected: true,
    address: {
        country: "israel",
        city: "KASH",
        street: "ben gurion 10"
    },
    allgrades: [80, 90, 100, 85]
}

let newGrade = userObj.grade + 10;
userObj.grade += 10;
userObj.id = 1000;

let userObj2 = userObj;
userObj.grade += 10;
userObj2.grade = 0;
let grade1 = userObj.grade;

let arr = [userObj, {
    country: "israel",
    city: "KASH",
    street: "ben gurion 10",
    allgrades: [{ csharp: 88 }, { CPP: 80 }, 95, 100],
}];

arr[0].allgrades[1] = 50;

arr[1].avg = 95;

let user2 = arr[1];
user2.password = "12345";