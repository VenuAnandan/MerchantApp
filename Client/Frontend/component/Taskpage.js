import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import { useFocusEffect } from '@react-navigation/native';


const audioFiles = [
    { name: 'audio1', uri: require('../assets/welcome-traveler-97167.mp3') },
    { name: 'audio2', uri: require('../assets/oh-my-god-80149.mp3') },
    { name: 'one', uri: require('../assets/one.mp3') },
    { name: 'two', uri: require('../assets/two.mp3') },
    { name: 'three', uri: require('../assets/three.mp3') },
    { name: 'four', uri: require('../assets/four.mp3') },
    { name: 'five', uri: require('../assets/five.mp3') },
    { name: 'six', uri: require('../assets/six.mp3') },
    { name: 'seven', uri: require('../assets/seven.mp3') },
    { name: 'eight', uri: require('../assets/eight.mp3') },
    { name: 'nine', uri: require('../assets/nine.mp3') },
    { name: 'ten', uri: require('../assets/ten.mp3') },
    { name: 'eleven', uri: require('../assets/eleven.mp3') },
    { name: 'twelve', uri: require('../assets/twelve.mp3') },
    { name: 'thirteen', uri: require('../assets/thirteen.mp3') },
    { name: 'fourteen', uri: require('../assets/fourteen.mp3') },
    { name: 'fifteen', uri: require('../assets/fifteen.mp3') },
    { name: 'sixteen', uri: require('../assets/sixteen.mp3') },
    { name: 'seventeen', uri: require('../assets/seventeen.mp3') },
    { name: 'eighteen', uri: require('../assets/eighteen.mp3') },
    { name: 'nineteen', uri: require('../assets/nineteen.mp3') },
    { name: 'twenty', uri: require('../assets/twenty.mp3') },
    { name: 'thirty', uri: require('../assets/thirty.mp3') },
    { name: 'forty', uri: require('../assets/forty.mp3') },
    { name: 'fifty', uri: require('../assets/fifty.mp3') },
    { name: 'sixty', uri: require('../assets/sixty.mp3') },
    { name: 'seventy', uri: require('../assets/seventy.mp3') },
    { name: 'eighty', uri: require('../assets/eighty.mp3') },
    { name: 'ninety', uri: require('../assets/ninety.mp3') },
    { name: 'crore', uri: require('../assets/crore.mp3') },
    { name: 'lakh', uri: require('../assets/lakh.mp3') },
    { name: 'thousand', uri: require('../assets/thousand.mp3') },
    { name: 'hundred', uri: require('../assets/hundred.mp3') },
    { name: 'recevied', uri: require('../assets/recevied.mp3') },
    { name: 'ஒன்று', uri: require('../assets/ஒன்று.mp3') },  //=======
    { name: 'இரண்டு', uri: require('../assets/இரண்டு.mp3') },
    { name: 'மூன்று', uri: require('../assets/மூன்று.mp3') },
    { name: 'நான்கு', uri: require('../assets/நான்கு.mp3') },
    { name: 'ஐந்து', uri: require('../assets/ஐந்து.mp3') },
    { name: 'ஆறு', uri: require('../assets/ஆறு.mp3') },
    { name: 'ஏழு', uri: require('../assets/ஏழு.mp3') },
    { name: 'எட்டு', uri: require('../assets/எட்டு.mp3') },
    { name: 'ஒன்பது', uri: require('../assets/ஒன்பது.mp3') },
    { name: 'பத்து', uri: require('../assets/பத்து.mp3') },
    { name: 'பதினொன்று', uri: require('../assets/பதினொன்று.mp3') },
    { name: 'பன்னிரண்டு', uri: require('../assets/பன்னிரண்டு.mp3') },
    { name: 'பதின்மூன்று', uri: require('../assets/பதின்மூன்று.mp3') },
    { name: 'பதினான்கு', uri: require('../assets/பதினான்கு.mp3') },
    { name: 'பதினைந்து', uri: require('../assets/பதினைந்து.mp3') },
    { name: 'பதினாறு', uri: require('../assets/பதினாறு.mp3') },
    { name: 'பதினேழு', uri: require('../assets/பதினேழு.mp3') },
    { name: 'பதினெட்டு', uri: require('../assets/பதினெட்டு.mp3') },
    { name: 'பத்தொன்பது', uri: require('../assets/பத்தொன்பது.mp3') },
    { name: 'இருபது', uri: require('../assets/இருபது.mp3') },
    { name: 'முப்பது', uri: require('../assets/முப்பது.mp3') },
    { name: 'நாற்பது', uri: require('../assets/நாற்பது.mp3') },
    { name: 'ஐம்பது', uri: require('../assets/ஐம்பது.mp3') },
    { name: 'அறுபது', uri: require('../assets/அறுபது.mp3') },
    { name: 'எழுபது', uri: require('../assets/எழுபது.mp3') },
    { name: 'எண்பது', uri: require('../assets/எண்பது.mp3') },
    { name: 'தொண்ணூறு', uri: require('../assets/தொண்ணூறு.mp3') },
    { name: 'கோடி', uri: require('../assets/கோடி.mp3') },
    { name: 'இலட்சம்', uri: require('../assets/இலட்சம்.mp3') },
    { name: 'ஆயிரம்', uri: require('../assets/ஆயிரம்.mp3') },
    { name: 'நூறு', uri: require('../assets/நூறு.mp3') },
    { name: 'பெறப்பட்ட தொகை', uri: require('../assets/பெறப்பட்ட தொகை.mp3') },
    { name: 'ഒന്ന്', uri: require('../assets/ഒന്ന്.mp3') },
    { name: 'രണ്ട്', uri: require('../assets/രണ്ട്.mp3') },
    { name: 'മൂന്ന്', uri: require('../assets/മൂന്ന്.mp3') },
    { name: 'നാല്', uri: require('../assets/നാല്.mp3') },
    { name: 'അഞ്ച്', uri: require('../assets/അഞ്ച്.mp3') },
    { name: 'ആറ്', uri: require('../assets/ആറ്.mp3') },
    { name: 'ഏഴ്', uri: require('../assets/ഏഴ്.mp3') },
    { name: 'എട്ട്', uri: require('../assets/എട്ട്.mp3') },
    { name: 'ഒമ്പത്', uri: require('../assets/ഒമ്പത്.mp3') },
    { name: 'പത്ത്', uri: require('../assets/പത്ത്.mp3') },
    { name: 'പതിനൊന്ന്', uri: require('../assets/പതിനൊന്ന്.mp3') },
    { name: 'പന്ത്രണ്ട്', uri: require('../assets/പന്ത്രണ്ട്.mp3') },
    { name: 'പതിമൂന്ന്', uri: require('../assets/പതിമൂന്ന്.mp3') },
    { name: 'പതിനാല്', uri: require('../assets/പതിനാല്.mp3') },
    { name: 'പതിനഞ്ച്', uri: require('../assets/പതിനഞ്ച്.mp3') },
    { name: 'പതിനാറ്', uri: require('../assets/പതിനാറ്.mp3') },
    { name: 'പതിനേഴ്', uri: require('../assets/പതിനേഴ്.mp3') },
    { name: 'പതിനെട്ട്', uri: require('../assets/പതിനെട്ട്.mp3') },
    { name: 'പത്തൊൻപത്', uri: require('../assets/പത്തൊൻപത്.mp3') },
    { name: 'ഇരുപത്', uri: require('../assets/ഇരുപത്.mp3') },
    { name: 'മുപ്പത്', uri: require('../assets/മുപ്പത്.mp3') },
    { name: 'നാല്പത്', uri: require('../assets/നാല്പത്.mp3') },
    { name: 'അമ്പത്', uri: require('../assets/അമ്പത്.mp3') },
    { name: 'അറുപത്', uri: require('../assets/അറുപത്.mp3') },
    { name: 'എഴുപത്', uri: require('../assets/എഴുപത്.mp3') },
    { name: 'എൺപത്', uri: require('../assets/എൺപത്.mp3') },
    { name: 'തൊണ്ണൂറ്', uri: require('../assets/തൊണ്ണൂറ്.mp3') },
    { name: 'കോടി', uri: require('../assets/കോടി.mp3') },
    { name: 'ലക്ഷം', uri: require('../assets/ലക്ഷം.mp3') },
    { name: 'ആയിരം', uri: require('../assets/ആയിരം.mp3') },
    { name: 'നൂറ്', uri: require('../assets/നൂറ്.mp3') },
    { name: 'തിരിച്ചടച്ച തുക', uri: require('../assets/തിരിച്ചടച്ച തുക.mp3') },
    { name: 'प्राप्त राशि', uri: require('../assets/प्राप्त राशि.mp3') },
    { name: 'एक', uri: require('../assets/एक.mp3') },
    { name: 'दो', uri: require('../assets/दो.mp3') },
    { name: 'तीन', uri: require('../assets/तीन.mp3') },
    { name: 'चार', uri: require('../assets/चार.mp3') },
    { name: 'पाँच', uri: require('../assets/पाँच.mp3') },
    { name: 'छह', uri: require('../assets/छह.mp3') },
    { name: 'सात', uri: require('../assets/सात.mp3') },
    { name: 'आठ', uri: require('../assets/आठ.mp3') },
    { name: 'नौ', uri: require('../assets/नौ.mp3') },
    { name: 'दस', uri: require('../assets/दस.mp3') },
    { name: 'ग्यारह', uri: require('../assets/ग्यारह.mp3') },
    { name: 'बारह', uri: require('../assets/बारह.mp3') },
    { name: 'तेरह', uri: require('../assets/तेरह.mp3') },
    { name: 'चौदह', uri: require('../assets/चौदह.mp3') },
    { name: 'पंद्रह', uri: require('../assets/पंद्रह.mp3') },
    { name: 'सोलह', uri: require('../assets/सोलह.mp3') },
    { name: 'सत्रह', uri: require('../assets/सत्रह.mp3') },
    { name: 'अठारह', uri: require('../assets/अठारह.mp3') },
    { name: 'उन्नीस', uri: require('../assets/उन्नीस.mp3') },
    { name: 'बीस', uri: require('../assets/बीस.mp3') },
    { name: 'तीस', uri: require('../assets/तीस.mp3') },
    { name: 'चालीस', uri: require('../assets/चालीस.mp3') },
    { name: 'पचास', uri: require('../assets/पचास.mp3') },
    { name: 'साठ', uri: require('../assets/साठ.mp3') },
    { name: 'सत्तर', uri: require('../assets/सत्तर.mp3') },
    { name: 'अस्सी', uri: require('../assets/अस्सी.mp3') },
    { name: 'नब्बे', uri: require('../assets/नब्बे.mp3') },
    { name: 'करोड़', uri: require('../assets/करोड़.mp3') },
    { name: 'लाख', uri: require('../assets/लाख.mp3') },
    { name: 'हजार', uri: require('../assets/हजार.mp3') },
    { name: 'सौ', uri: require('../assets/सौ.mp3') },

]




const Taskpage = ({ navigation }) => {

    const Langauages = ["English", "Tamil", "Malayalam", "Hindi"];
    const [language, setLanguage] = useState("English");
    const [translatedText, setTranslatedText] = useState("");
    const originalText = "Welcome to my app";

    const [amount, setAmount] = useState("");
    const [textamount, setTextamount] = useState("");

    // for audio Check function with samples

    let audioTrack = useRef(null);
    let stopAudio = useRef(false);

    let currentFiles = useRef([]);
    let currentIndex = useRef(0);
    let nextAudioFile = useRef([]);

    const playAudioSequentially = async (files, startFromZero = true) => {

        if (startFromZero) {
            if (audioTrack.current) {
                nextAudioFile.current.push(files);
                return;
            }
            currentFiles.current = files;
            currentIndex.current = 0;
        }

        if (stopAudio.current) return;

        const file = currentFiles.current;
        const index = currentIndex.current;

        if (index >= file.length || !file[index]) {
            if (nextAudioFile.current.length > 0) {
                currentFiles.current = nextAudioFile.current.shift();
                currentIndex.current = 0;
                playAudioSequentially(currentFiles.current, false);
            }
            return;
        };

        const { uri } = file[index];
        const soundObject = new Audio.Sound();
        // console.log(soundObject);

        try {
            await soundObject.loadAsync(uri);
            audioTrack.current = soundObject;
            await soundObject.playAsync();
            soundObject.setOnPlaybackStatusUpdate(async (status) => {
                // console.log(status.didJustFinish,"audioPlayed Status");
                if (status.didJustFinish) {
                    await soundObject.unloadAsync();
                    audioTrack.current = null;
                    currentIndex.current += 1;
                    // console.log(files[index]);
                    if (!stopAudio.current) {
                        playAudioSequentially(file, false);
                    }
                }
            });
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    const stopAudioTrack = async () => {
        stopAudio.current = true;
        if (audioTrack.current) {
            try {
                await audioTrack.current.stopAsync();
                await audioTrack.current.unloadAsync();
                audioTrack.current == null;
            } catch (error) {
                console.log(error);
            }
        }
        currentFiles.current = [];
        nextAudioFile.current = [];
        currentIndex.current = 0;
    };
    // ------------------------------------

    const printamount = (num, filterLanguage) => {
        num = parseInt(num);
        if (isNaN(num)) return "";

        if (num === 0) return filterLanguage === "Tamil" ? "பூஜ்யம்" : "zero";

        let words = [];

        const ones =
            filterLanguage === "Tamil" ?
                ["", "ஒன்று", "இரண்டு", "மூன்று", "நான்கு", "ஐந்து", "ஆறு", "ஏழு", "எட்டு", "ஒன்பது"]
                : filterLanguage === 'Spanish' ?
                    ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"]
                    : filterLanguage === 'Malayalam' ?
                        ["", "ഒന്ന്", "രണ്ട്", "മൂന്ന്", "നാല്", "അഞ്ച്", "ആറ്", "ഏഴ്", "എട്ട്", "ഒമ്പത്"]
                        : filterLanguage === 'Hindi' ?
                            ["", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ"]
                            :
                            ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

        const teens =
            filterLanguage === "Tamil" ?
                ["பத்து", "பதினொன்று", "பன்னிரண்டு", "பதின்மூன்று", "பதினான்கு", "பதினைந்து", "பதினாறு", "பதினேழு", "பதினெட்டு", "பத்தொன்பது"]
                : filterLanguage === 'Spanish' ?
                    ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"]
                    : filterLanguage === 'Malayalam' ?
                        ["പത്ത്", "പതിനൊന്ന്", "പന്ത്രണ്ട്", "പതിമൂന്ന്", "പതിനാല്", "പതിനഞ്ച്", "പതിനാറ്", "പതിനേഴ്", "പതിനെട്ട്", "പത്തൊൻപത്"]
                        : filterLanguage === 'Hindi' ?
                            ["दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस"]
                            :
                            ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

        const tens =
            filterLanguage === "Tamil" ?
                ["", "", "இருபது", "முப்பது", "நாற்பது", "ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"]
                : filterLanguage === 'Spanish' ?
                    ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"]
                    : filterLanguage === 'Malayalam' ?
                        ["", "", "ഇരുപത്", "മുപ്പത്", "നാല്പത്", "അമ്പത്", "അറുപത്", "എഴുപത്", "എൺപത്", "തൊണ്ണൂറ്"]
                        : filterLanguage === 'Hindi' ?
                            ["", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"]
                            :
                            ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

        const scales =
            filterLanguage === "Tamil"
                ? [
                    { divisor: 10000000, label: "கோடி" },
                    { divisor: 100000, label: "இலட்சம்" },
                    { divisor: 1000, label: "ஆயிரம்" },
                    { divisor: 100, label: "நூறு" }
                ]
                : filterLanguage === 'Spanish' ?
                    [
                        { divisor: 10000000, label: "crore" },
                        { divisor: 100000, label: "lakh" },
                        { divisor: 1000, label: "mil" },
                        { divisor: 100, label: "cien" }
                    ]
                    : filterLanguage === 'Malayalam' ?
                        [
                            { divisor: 10000000, label: "കോടി" },
                            { divisor: 100000, label: "ലക്ഷം" },
                            { divisor: 1000, label: "ആയിരം" },
                            { divisor: 100, label: "നൂറ്" }
                        ]
                        : filterLanguage === 'Hindi' ?
                            [{ divisor: 10000000, label: "करोड़" },
                            { divisor: 100000, label: "लाख" },
                            { divisor: 1000, label: "हजार" },
                            { divisor: 100, label: "सौ" }
                            ]
                            :
                            [
                                { divisor: 10000000, label: "crore" },
                                { divisor: 100000, label: "lakh" },
                                { divisor: 1000, label: "thousand" },
                                { divisor: 100, label: "hundred" }
                            ];



        for (let scale of scales) {
            const unit = Math.floor(num / scale.divisor);
            if (unit > 0) {
                words.push(printamount(unit, filterLanguage) + " " + scale.label);
                num %= scale.divisor;
            }
        }

        if (num >= 20) {
            words.push(tens[Math.floor(num / 10)]);
            num %= 10;
        } else if (num >= 10) {
            words.push(teens[num - 10]);
            num = 0;
        }

        if (num > 0 && num < 10) {
            words.push(ones[num]);
        }


        return words.join(", ");
    };

    const getarrayText = () => {
        const Textarray = printamount(amount, language);
        const collectionarrays = Textarray.replaceAll(',', '');
        const arraylist = collectionarrays.split(" ").map((item) => [item]);
        if (language == "Tamil") {
            arraylist.splice(0, 0, ["பெறப்பட்ட தொகை"]);
        } else if (language == 'Malayalam') {
            arraylist.splice(0, 0, ["തിരിച്ചടച്ച തുക"]);
        } else if (language == "Hindi") {
            arraylist.splice(0, 0, ["प्राप्त राशि"]);
        } else {
            arraylist.splice(0, 0, ["recevied"]);
        }
        // console.log(arraylist);
        // console.log(audioFiles);


        const getMatchedAudioFile = () => {
            return arraylist.map(([name]) => audioFiles.find(file => file.name === name));
        };

        const NumberOerderAudioFiles = getMatchedAudioFile();
        // console.log(NumberOerderAudioFiles);
        playAudioSequentially(NumberOerderAudioFiles);
        setTextamount(Textarray);
    };


    useFocusEffect(
        useCallback(() => {
            stopAudio.current = false;

            return () => {
                stopAudioTrack();
            };
        }, [])
    );

    return (
        // <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <StatusBar style="auto" />

            <Text style={styles.header}>Amount to Words Converter</Text>

            <Picker
                selectedValue={language}
                onValueChange={(value) => setLanguage(value)}
                style={styles.picker}
            >
                {Langauages.map((item) => (
                    <Picker.Item key={item} value={item} label={item} />
                ))}
            </Picker>

            <TextInput
                maxLength={9}
                keyboardType="number-pad"
                style={styles.textinput}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter Amount"
            />

            <View style={styles.buttonContainer}>
                <Button title="Convert" onPress={getarrayText} />
            </View>

            {textamount ? (
                <Text style={styles.resultText}>{textamount || originalText}</Text>
            ) : (
                <Text style={styles.placeholderText}>----</Text>
            )}
            {/* <Button title="Play Audio" onPress={handlePlay} /> */}
        </ScrollView>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    scrollContent: {
        padding: 20,
        justifyContent: "center",
        flexGrow: 1
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    picker: {
        height: 50,
        marginBottom: 20
    },
    textinput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 18
    },
    buttonContainer: {
        marginBottom: 20
    },
    resultText: {
        fontSize: 22,
        textAlign: "center",
        color: "green"
    },
    placeholderText: {
        textAlign: "center",
        fontSize: 20,
        color: "#aaa"
    }
});

export default Taskpage;



function numberToTamilText(number) {
    const ones = ['', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது'];
    const tens = ['', 'பத்து', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது', 'அறுபது', 'எழுபது', 'எண்பது', 'தொன்னூறு'];

    if (number === 0) return 'பூஜ்ஜியம்';

    function twoDigitToTamil(n) {
        if (n < 10) return ones[n];
        if (n >= 10 && n < 20) {
            if (n === 10) return 'பத்து';
            return 'பதின்' + ones[n - 10];
        }
        const tensPlace = Math.floor(n / 10);
        const onesPlace = n % 10;
        return tens[tensPlace] + (onesPlace ? ' ' + ones[onesPlace] : '');
    }

    function threeDigitToTamil(n) {
        if (n === 0) return '';
        if (n < 100) return twoDigitToTamil(n);
        const hundredsPlace = Math.floor(n / 100);
        const remainder = n % 100;
        let text = ones[hundredsPlace] + ' நூறு';
        if (remainder) text += 'த்து ' + twoDigitToTamil(remainder);
        return text;
    }

    let result = '';

    const crore = Math.floor(number / 10000000);
    number %= 10000000;
    const lakh = Math.floor(number / 100000);
    number %= 100000;
    const thousand = Math.floor(number / 1000);
    number %= 1000;
    const hundreds = number;

    if (crore > 0) {
        result += (crore > 1 ? twoDigitToTamil(crore) : 'ஒரு') + ' கோடி ';
    }
    if (lakh > 0) {
        result += (lakh > 1 ? twoDigitToTamil(lakh) : ' லட்சத்து ');
    }
    if (thousand > 0) {
        result += (thousand > 1 ? twoDigitToTamil(thousand) : ' ஓர்') + ' ஆயிரத்து ';
    }
    if (hundreds > 0) {
        result += threeDigitToTamil(hundreds) + ' ';
    }

    return result.trim().replace(/\s+/g, ' ');
}