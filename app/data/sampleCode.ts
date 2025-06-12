interface CodeSample {
  code: string;
  description: string;
}

interface SampleCodeData {
  [key: string]: CodeSample[];
}

export const sampleCode: SampleCodeData = {
  javascript: [
    {
      description: "Inefficient array manipulation with potential memory leaks",
      code: `function processData(data) {
  var results = [];
  for (var i = 0; i < data.length; i++) {
    results.push(data[i] * 2);
  }
  return results;
}

setInterval(function() {
  const largeArray = new Array(1000000).fill(1);
  const processed = processData(largeArray);
  console.log(processed.length);
}, 1000);`,
    },
    {
      description: "Insecure authentication implementation",
      code: `function login(username, password) {
  // Store password in plain text
  const users = {
    admin: "password123",
    user: "qwerty"
  };
  
  if (users[username] === password) {
    return { token: "secret-token-" + username };
  }
  return null;
}`,
    },
    {
      description: "Poor error handling and callback hell",
      code: `function fetchUserData(userId, callback) {
  database.query("SELECT * FROM users WHERE id = " + userId, function(err, user) {
    if (user) {
      database.query("SELECT * FROM orders WHERE user_id = " + userId, function(err, orders) {
        if (orders) {
          database.query("SELECT * FROM products WHERE id IN (" + orders.map(o => o.product_id).join(",") + ")", function(err, products) {
            callback(null, { user, orders, products });
          });
        }
      });
    }
  });
}`,
    },
  ],
  python: [
    {
      description: "Resource management and error handling issues",
      code: `def process_file(filename):
    f = open(filename, 'r')
    data = f.read()
    # File never closed
    return data.split('\\n')

def main():
    try:
        data = process_file('data.txt')
        print(f"Processing {len(data)} lines")
    except:
        # Bare except clause
        print("Error occurred")

if __name__ == "__main__":
    main()`,
    },
    {
      description: "Inefficient algorithm implementation",
      code: `def find_duplicates(numbers):
    duplicates = []
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] == numbers[j] and numbers[i] not in duplicates:
                duplicates.append(numbers[i])
    return duplicates

# Test with large dataset
test_data = [x % 100 for x in range(10000)]
result = find_duplicates(test_data)`,
    },
    {
      description: "Global state and thread safety issues",
      code: `import threading

counter = 0

def increment_counter():
    global counter
    for _ in range(1000000):
        counter += 1

threads = []
for _ in range(4):
    t = threading.Thread(target=increment_counter)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(f"Final count: {counter}")`,
    },
  ],
  java: [
    {
      description: "Memory leak in resource handling",
      code: `import java.io.*;

public class ResourceLeakExample {
    public static String readFile(String path) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(path));
        StringBuilder content = new StringBuilder();
        String line;
        
        while ((line = reader.readLine()) != null) {
            content.append(line);
        }
        
        // Reader never closed
        return content.toString();
    }
    
    public static void main(String[] args) {
        try {
            String content = readFile("large_file.txt");
            System.out.println("File length: " + content.length());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`,
    },
    {
      description: "Concurrency issues in shared state",
      code: `public class BankAccount {
    private double balance;
    
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        balance += amount;
    }
    
    public void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
        }
    }
    
    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);
        
        // Multiple threads accessing shared state
        new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                account.deposit(10);
            }
        }).start();
        
        new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                account.withdraw(10);
            }
        }).start();
    }
}`,
    },
  ],
  c: [
    {
      description: "Buffer overflow vulnerability",
      code: `#include <stdio.h>
#include <string.h>

void process_input(char *input) {
    char buffer[10];
    strcpy(buffer, input);  // No bounds checking
    printf("Processing: %s\\n", buffer);
}

int main() {
    char *user_input = "This is a very long input that will overflow the buffer";
    process_input(user_input);
    return 0;
}`,
    },
    {
      description: "Memory management issues",
      code: `#include <stdlib.h>
#include <stdio.h>

int* create_array(int size) {
    int* arr = malloc(size * sizeof(int));
    for(int i = 0; i < size; i++) {
        arr[i] = i;
    }
    return arr;  // Memory leak: caller might not free
}

int main() {
    int* numbers = create_array(1000);
    // Use numbers array
    printf("First number: %d\\n", numbers[0]);
    // Memory never freed
    return 0;
}`,
    },
  ],
  solidity: [
    {
      description: "Reentrancy vulnerability",
      code: `contract VulnerableContract {
    mapping(address => uint) public balances;
    
    function withdraw() public {
        uint amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] = 0;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}`,
    },
    {
      description: "Integer overflow and unchecked math",
      code: `contract TokenContract {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
    
    function mint(uint256 amount) public {
        balances[msg.sender] += amount;
    }
}`,
    },
  ],
  rust: [
    {
      description: "Unsafe memory access",
      code: `use std::ptr;

fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];
    let raw_ptr = numbers.as_mut_ptr();
    
    unsafe {
        // Dangerous direct memory manipulation
        ptr::write(raw_ptr.offset(5), 6);
    }
    
    println!("Numbers: {:?}", numbers);
}`,
    },
    {
      description: "Race condition in thread communication",
      code: `use std::thread;
use std::sync::Arc;

fn main() {
    let counter = Arc::new(0);
    let mut handles = vec![];
    
    for _ in 0..3 {
        let counter_ref = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // Race condition: multiple threads updating shared state
            *counter_ref += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("Final count: {}", *counter);
}`,
    },
  ],
}; 