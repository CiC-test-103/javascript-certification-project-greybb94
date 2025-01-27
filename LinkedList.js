// Necessary Imports (you will need to use this)
const { Student } = require('./Student')

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    let current = this.head;
  
    // duplicate student verification logic has been added
    while (current !== null) {
      if (current.data.getEmail() === newStudent.getEmail()) {
        console.log(`Student with email ${newStudent.getEmail()} already exists.`);
        return;  // Terminate without adding if a duplicate is found
      }
      current = current.next;
    }
  
    // new student logic
    const newNode = new Node(newStudent);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    if (!this.head) {
      console.log(`Student with email ${email} not found.`);
      return;
    }

    if (this.head.data.getEmail() === email) {
      this.head = this.head.next;
      this.length--;
      return;
    }

    let current = this.head;
    let prev = null;
    while (current !== null && current.data.getEmail() !== email) {
      prev = current;
      current = current.next;
    }

    if (current === null) {
      console.log(`Student with email ${email} not found.`);
      return;
    }
    
    prev.next = current.next;
    if (current === this.tail) {
      this.tail = prev;
    }
    this.length--;
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let current = this.head;
    while (current !== null) {
      if (current.data.getEmail() === email) {
        return current.data;
      }
      current = current.next;
    }
    return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  #clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  // new public method added
  clearAll() {
    this.#clearStudents();
  }
  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let result = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.data.getName());
      current = current.next;
    }
    return result.join(", ");
  }
  

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    let students = [];
    let current = this.head;
    while (current !== null) {
      students.push(current.data);
      current = current.next;
    }
    return students.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    return this.#sortStudentsByName().filter(student => student.getSpecialization() === specialization);
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    // TODO
    return this.#sortStudentsByName().filter(student => student.getYear() >= minAge);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) { 
    // TODO
    const fs = require('fs').promises;
    let students = [];
    let current = this.head;
    while (current !== null) {
      students.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization()
      });
      current = current.next;
    }
    await fs.writeFile(fileName, JSON.stringify(students, null, 2));
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) { 
    // TODO
    const fs = require('fs').promises;
    const data = await fs.readFile(fileName, 'utf8');
    const students = JSON.parse(data);

    this.#clearStudents();

    students.forEach(student => {
      const newStudent = new Student(student.name, student.year, student.email, student.specialization);
      this.addStudent(newStudent);
    });
  }
}

module.exports = { LinkedList }
