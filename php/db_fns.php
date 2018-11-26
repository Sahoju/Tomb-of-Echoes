<?php
    class Init {
        private $conn;
        
        public function __construct() {
            $servername = 'mysql.labranet.jamk.fi';
            $username = 'L4929';
            $password = '60FXAM0zUfFdMIlVPy3P4eb7pVtEnHl7'; // YOLO
            $dbname = 'L4929_3';

            $this->conn = new mysqli($servername, $username, $password, $dbname);
            if ($this->conn->connect_error) {
                die('Connection failed:' . $this->conn->connect_error);
            }
        } // END public function __construct()

        /************************* public function getLocations() ***************************/
        
        public function getLocations() {
            $loc = array(9);
            $locthree = array(3);
            
            for($i = 0; $i < 3; $i++) {
                $locthree[0] = array(rand(0,2), rand(0,2), '');
                // check for duplicates
                do {
                    $locthree[1] = array(rand(0,2), rand(0,2), '');
                } while($locthree[0] == $locthree[1]);
                do {
                    $locthree[2] = array(rand(0,2), rand(0,2), '');
                } while($locthree[2] == $locthree[0] OR $locthree[2] == $locthree[1]);

                /*
                for($j = 0; $j < 3; $j++) {
                    echo '$locthree[' . $j . ']: ' . $locthree[$j] . '<br/>';
                }
                */
                
                $loc[0 + $i * 3] = $locthree[0];
                $loc[1 + $i * 3] = $locthree[1];
                $loc[2 + $i * 3] = $locthree[2];
            }

            return $loc;
        } // END public function getLocations()
        
        /************************* public function getTexts($loc) ***************************/

        public function getTexts() {
            $loc = $this->getLocations();
            // 9 texts, three for each phase
            $text = array(9);

            for($i = 0; $i < 9; $i++) {
                $sql = 'SELECT content FROM writing WHERE locx = ' . $loc[$i][0] . ' AND locy = ' . $loc[$i][1];
                $result = $this->conn->query($sql);

                // choose randomly a text from the MySQL query
                $texttochoose = rand(0, $result->num_rows - 1);
                // for finding the random text from the query
                $textcurrent = 0;
                while($row = $result->fetch_assoc()) {
                    if($textcurrent == $texttochoose) {
                        // echo '$i: ' . $i . ', $row["content"]: ' . $row['content'] . '<br/>';
                        $text[$i] = $row['content'];
                        break;
                    }
                    $textcurrent++;
                }
            }
            
            $texts = array();
            
            // the array's key consists of phase, locx and locy
            // i.e. 001 = phase 1, locx 0, locy 1
            // i.e. 222 = phase 3, locx 2, locy 2
            for($i = 0; $i < 9; $i++) {
                if($i < 3) {
                    $texts['0' . (string)$loc[$i][0] . (string)$loc[$i][1]] = $text[$i];
                } else if($i < 6) {
                    $texts['1' . (string)$loc[$i][0] . (string)$loc[$i][1]] = $text[$i];
                } else {
                    $texts['2' . (string)$loc[$i][0] . (string)$loc[$i][1]] = $text[$i];
                }
            }

            return $texts;
        } // END public function getTexts($locs)
        
        /************************* public function testLocationAndTexts($loc, $texts) ***************************/
        
        public function testLocationAndTexts() {
            for($i = 0; $i < 9; $i++) {
                echo '$loc[' . $i . ']: ' . $loc[$i] . '<br/>';
            }
            for($i = 0; $i < 9; $i++) {
                echo '$texts[' . $i . ']: ' . $texts[$i] . '<br/>';
            }
        } // END public function testLocationAndTexts($loc, $texts)
    }
?>