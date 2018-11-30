<?php
    class Init {
        private $conn;
        
        public function __construct() {
            try {
                // connecting to database
                $this->conn = new
                    PDO('mysql:host=mysql.labranet.jamk.fi;dbname=L4929_3;charset=utf8', 'L4929', '60FXAM0zUfFdMIlVPy3P4eb7pVtEnHl7');
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $ex) {
                echo "ErrMsg to enduser!<hr>\n";
                echo "CatchErrMsg: " . $ex->getMessage() . "<hr>\n";
            }
            
            /* mysqli
            $servername = 'mysql.labranet.jamk.fi';
            $username = 'L4929';
            $password = '60FXAM0zUfFdMIlVPy3P4eb7pVtEnHl7'; // YOLO
            $dbname = 'L4929_3';

            $this->conn = new mysqli($servername, $username, $password, $dbname);
            if ($this->conn->connect_error) {
                die('Connection failed:' . $this->conn->connect_error);
            }
            */
        } // END public function __construct()

        /************************* public function getLocations() ***************************/
        
        public function getLocations() {
            // 9 locations; 3 for each phase
            $loc = array(9);
            // generate locations for each phase
            // every message in each phase is in different locations
            // never two or more in the same spot
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

                /* testing
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
            // get locations from getLocations() function
            // only getTexts() function is called from outside
            // getLocations() has been left as a public function
            // in case something goes awry during development
            $loc = $this->getLocations();
            // 9 texts, three for each phase
            $text = array(9);

            for($i = 0; $i < 9; $i++) {
                // SQL query for getting all messages from a generated location
                $sql = 'SELECT content FROM writing WHERE locx = ' . $loc[$i][0] . ' AND locy = ' . $loc[$i][1];
                $result = $this->conn->prepare($sql);
                $result->execute();

                // choose randomly a text from the MySQL query
                $texttochoose = rand(0, $result->rowCount() - 1);
                // for finding the random text from the query
                $textcurrent = 0;
                while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                    if($textcurrent == $texttochoose) {
                        // echo '$i: ' . $i . ', $row["content"]: ' . $row['content'] . '<br/>';
                        $text[$i] = $row['content'];
                        break;
                    }
                    $textcurrent++;
                }
            }
            
            // array to put both location and text in
            // the array's key consists of phase, locx and locy
            // i.e. 001 = phase 1, locx 0, locy 1
            // i.e. 222 = phase 3, locx 2, locy 2
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
        
        public function putText($locx, $locy, $content) {
            $sql = <<<SQL
                INSERT INTO writing (locx, locy, content) VALUES (
                    $locx, $locy, '$content'
                )
SQL;
            $result = $this->conn->prepare($sql);
            $result->execute();
        }
        
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