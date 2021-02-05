export function uniq(existing, new_guess) {
    return existing.indexOf(new_guess) === -1;
}

export function nonDupe(str) {
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j < str.length; j++) {
            if (str[i] === str[j]) {
                return false;
            }
        }
    }
    return true;
}

export function generate_secret() {
    // generate the random string this way instead of directly using math.random to avoid beginning or trailing 0 issues
    let numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let secret = [];
    for (let i = 0; i < 4; i++) {
        let randomNumber = Math.floor(Math.random() * numArray.length);
        if (!secret.includes(numArray[randomNumber])) {
            secret.push(numArray[randomNumber]);
        } else {
            i--;
        }
    }
    secret = secret.join("");
    return secret;
}

export function check_answer(secret, guess) {
    let sec_digits = secret.split('');
    let guess_digits = guess.split('');

    let guess_marked = [];

    for (let i = 0; i < sec_digits.length; i++) {
        guess_marked[i] = false;
    }

    let bull_count = 0;
    let cow_count = 0;

    // mark all bulls first before going on to cows, to avoid mistakes
    for (let i = 0; i < guess_digits.length; i++) {
        if (guess_digits[i] === sec_digits[i]) {
            bull_count++;
            guess_marked[i] = true;
        }
    }

    for (let i = 0; i < guess_digits.length; i++) {
        //if we haven't already marked a digit as a bull, check if it's a cow
        if (!guess_marked[i]) {
            for (let j = 0; j < sec_digits.length; j++) {
                if (guess_digits[i] === sec_digits[j]) {
                    cow_count++;
                    break;
                }
            }
        }
    }
    return ([bull_count, cow_count]);
}

