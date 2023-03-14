const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const http = require('http')
var parseUrl = require('body-parser')
const app = express()

var mysql = require('mysql')
const { encode } = require('punycode')
const path = require('path')

let encodeUrl = parseUrl.urlencoded({ extended: false })

app.use('/assets/css', express.static('css'))

//session middleware
app.use(express.json());

app.use(
  sessions({
    secret: 'thisismysecrctekey',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
  })
)

app.use(cookieParser())

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root', // my username
  password: 'root000', // my password
  database: 'db_auth'
})

//get static file
app.use(express.static('assets'))
//Reference from https://stackoverflow.com/questions/5924072/express-js-cant-get-my-static-files-why
app.use('*/css', express.static(path.join(__dirname, 'assets/css')))
app.use('*/js', express.static(path.join(__dirname, 'assets/js')))
app.use('*/scss', express.static(path.join(__dirname, 'assets/scss')))
app.use('*/vendor', express.static(path.join(__dirname, 'assets/vendor')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//---========== START: LOGIN ---===============
app.post('/login', encodeUrl, (req, res) => {
  var userName = req.body.userName
  var password = req.body.password

  con.connect(function (err) {
    if (err) {
      console.log(err)
    }
    con.query(
      `SELECT * FROM tbl_auth_reg WHERE username = '${userName}' AND password = '${password}'`,
      function (err, result) {
        if (err) {
          console.log(err)
        }

        function userPage () {
          //Create a session for the dashboard (user page) page
          // save the user data to this session
          req.session.user = {
            username: userName,
            password: password
          }

          //Retrive to error message if condition is false
          res.send(`
            <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>RescueMe</title>

  <!-- Bootsrap and Other External CSS Files -->
  <link href="assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

  <!-- Main CSS File -->
  <link href="assets/css/landing_page.css" rel="stylesheet">
  <link href="assets/css/login.css" rel="stylesheet">

</head>

<body>

  <!--Start: Nav Header -->

  <!-- End: Nav header -->

  <!-- ====== Start: Section (Banner)====== -->
  <section id="banner" class="d-flex align-items-center">
    <div class="container">
      <div class="row">
        <h1 style="text-align:center">RescueMe</h1>
        <h2 style="text-align:center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique molestias
          sapiente eligendi cupiditate nam minima corporis maiores laborum et voluptate, mollitia doloribus, quibusdam
          quos perferendis, est eos quaerat. Aspernatur, nisi?</h2>
      </div>
    </div>
  </section>
  <!-- End: Section (Banner) -->

  <!-- ======Start: Main =======-->
  <main id="main">

    <!-- ======= START: Border ======= -->
    <!-- <div class="border horizontal-border-bg"> -->
    <header id="header" class="sticky-top">
      <div class="container d-flex align-items-center">
        <!--login username after login is successful-->
        <p class="logo me-auto" style="color: white;"> ${req.session.user.username}</p>
        <nav id="navbar" class="navbar">
          <ul>
            <li><a class="nav-link scrollto" href="#about-us">About Us</a></li>
            <li><a class="nav-link scrollto" href="feed.html">Feed</a></li>
            <li><a class="nav-link scrollto" href="adoption.html">Adoption</a></li>
            <li><a class="nav-link scrollto" href="vet.html">Vetenarian</a></li>
            <li><a class="nav-link scrollto" href="suggestion.html">Suggestion</a></li>
            <li><a class="nav-link scrollto" href="#login-signup-form">Login/Register</a></li>
          </ul>
          <i class="bi bi-list mobile-nav-toggle"></i>
        </nav>
        <!-- End: navbar -->
      </div>
    </header>
    <!-- </div> -->
    <!-- END: Border -->

    <!-- ======= START: About Us ======= -->
    <section id="about-us" class="about">
      <div class="container" data-aos="fade-up">
        <div class="section-title">
          <h2>About</h2>
        </div>
        <div class=" row content">
          <div class="mx-md-auto">
            <p class="p-about-us">
              
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- END: About Myself Section  -->


    <!-- ======= START: Login/Registration Form Section ======= -->
    <section id="login-signup-form" class="skills section-bg">
      <div class="container" data-aos="fade-up" style="margin: auto; display: inline-flexbox;">
        <div class="row">
          <div class="col-lg-6 pt-4 pt-lg-15" data-aos="fade-right" data-aos-delay="100">
            <div class="section-title">
              <h2>Login</h2>
            </div>
            <div class="skills-content">

              <!--Form action to server.js using post method-->
              <!--========START: Login Form=========-->
              <form action="/Login" method="POST">
                <div>
                  <label for="username" style="color:#000000;">Enter Username:<br />
                    <input type="text" name="userName" style=" width: 400px; height: 40px; padding: 5px; margin-top: 5px;
                    border: 1px solid gray;"/></label>
                </div>
                <div>
                  <label for="Password" style="color: #000000;">Enter password:<br />
                  <input type="password" name="password" style=" width: 400px; height: 40px; padding: 5px; margin-top: 5px;
                  border: 1px solid gray;"/></label>
                </div>
                <br>
                <div class="div_input_submit">
                  <button type="submit" class="btn_login">Login</button>
                </div>

                <!--Validation error message-->
                <div>
                  <h2 id="result1"></h2>
                  <h2 id="result2"></h2>
                  <h2 id="result3"></h2>
                  <h2 id="result4"></h2>
                  <h2 id="result5"></h2>
                  <h2 id="subscribe1"></h2>
                  <h2 id="error"></h2>
                </div>
              </form>
            </div>
          </div>
           <!--========END: Login Form=========-->


          <div class="col-lg-6 pt-4 pt-lg-15 " data-aos="fade-left" data-aos-delay="100">
            <div class="section-title">
              <h2>Sign Up</h2>
            </div>
            <div class="skills-content">
              <form action="/Register" method="POST">
                <!-- onsubmit="onSUbmitHandler(event)" -->
                <div>
                  <label for="username" style="color:#000000;">Enter Username:<br />
                    <input type="text" name="userName" style=" width: 400px; height: 40px; padding: 5px; margin-top: 5px;
                    border: 1px solid gray;"/></label>
                </div>
                <div>
                  <label for="Password" style="color: #000000;">Enter Password</label><br />
                  <input type="password" name="password"style=" width: 400px; height: 40px; padding: 5px;
                  border: 1px solid gray;"/></label>
                </div>
                <br>
                <div class="div_input_submit">
                  <button type="submit" class="btn_signup">Sign Up</button>
                </div>
                <div>
                  <h2 id="result1"></h2>
                  <h2 id="result2"></h2>
                  <h2 id="result3"></h2>
                  <h2 id="result4"></h2>
                  <h2 id="result5"></h2>
                  <h2 id="subscribe1"></h2>
                  <h2 id="error"></h2>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- ======= END: Login/Registration Form Section ======= -->

    <!-- ======= Top footer ======= -->
    <section id="contact-me" class="contact ">
      <div class="container" data-aos="fade-up">
        <div class="section-title">
          <h2></h2>
          <div class="row">
            <!-- <div class="col-lg-5" style="margin:auto" style="border:1px solid black">
              <div class="info">
                <div class="phone">
                  <h4>Contact Number</h4>
                  <p>8148496</p>
                </div>
                <div class="email">
                  <h4>Email:</h4>
                  <p><a href="mailto: mohdhifdzullah.matali@gmail.com">mohdhifdzullah.matali@gmail.com</a></p>
                </div>
              </div>
            </div> -->
          </div>
    </section>
    <!-- End Contact Section -->
  </main>
  <!-- End #main -->

  <!-- ======= Bottom Footer ======= -->
  <footer id="footer">
    <div class="container footer-bottom clearfix">
      <div class="copyright">
        &copy; Copyright <span>RescueMe 2023 <br>Hifdzullah Matali</span>
      </div>
    </div>
  </footer>
  <!-- End Footer -->

  <div id="preloader"></div>
  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i
      class="bi bi-arrow-up-short"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/aos/aos.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
  <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
  <script src="assets/vendor/waypoints/noframework.waypoints.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>

</body>

</html>
          
            `)
        }

        if (Object.keys(result).length > 0) {
          userPage()
        } else {
          res.sendFile(__dirname + '/error_log.html')
        }
      }
    )
  })
})

app.post('/register', encodeUrl, (req, res) => {
  // var firstName = req.body.firstName;
  // var lastName = req.body.lastName;
  var userName = req.body.userName
  var password = req.body.password

  con.connect(function (err) {
    if (err) {
      console.log(err)
    }
    // checking user already registered with identical username and password
    con.query(
      `SELECT * FROM tbl_auth_reg WHERE username = '${userName}' AND password  = '${password}'`,
      function (err, result) {
        if (err) {
          console.log(err)
        }
        if (Object.keys(result).length > 0) {
          res.sendFile(__dirname + '/error_log.html')
        } else {
          //creating user page in userPage function
          function userPage () {
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
              username: userName,
              password: password
            }

            res.send(`
                <!DOCTYPE html>
                <html lang="en">

                  <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">

                    <title>RescueMe</title>

                    <!-- Bootsrap and Other External CSS Files -->
                    <link href="assets/vendor/aos/aos.css" rel="stylesheet">
                    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
                    <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
                    <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
                    <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
                    <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
                    <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

                    <!-- Main CSS File -->
                    <link href="assets/css/landing_page.css" rel="stylesheet">
                    <link href="assets/css/login.css" rel="stylesheet">

                  </head>

                  <body>

                    <!--Start: Nav Header -->

                    <!-- End: Nav header -->

                    <!-- ====== Start: Section (Banner)====== -->
                    <section id="banner" class="d-flex align-items-center">
                      <div class="container">
                        <div class="row">
                          <h1 style="text-align:center">RescueMe</h1>
                          <h2 style="text-align:center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique molestias
                            sapiente eligendi cupiditate nam minima corporis maiores laborum et voluptate, mollitia doloribus, quibusdam
                            quos perferendis, est eos quaerat. Aspernatur, nisi?</h2>
                        </div>
                      </div>
                    </section>
                    <!-- End: Section (Banner) -->

                    <!-- ======Start: Main =======-->
                    <main id="main">

                      <!-- ======= START: Border ======= -->
                      <!-- <div class="border horizontal-border-bg"> -->
                      <header id="header" class="sticky-top">
                        <div class="container d-flex align-items-center">
                          <!--login username after login is successful-->
                          <p class="logo me-auto" style="color:#fff">Welcome, ${req.session.user.username}</p>
                          <nav id="navbar" class="navbar">
                            <ul>
                              <li><a class="nav-link scrollto" href="#about-us">About Us</a></li>
                              <li><a class="nav-link scrollto" href="feed.html">Feed</a></li>
                              <li><a class="nav-link scrollto" href="adoption.html">Adoption</a></li>
                              <li><a class="nav-link scrollto" href="vet.html">Vetenarian</a></li>
                              <li><a class="nav-link scrollto" href="suggestion.html">Suggestion</a></li>
                              <li><a class="nav-link scrollto" href="#login-signup-form">Login/Register</a></li>
                            </ul>
                            <i class="bi bi-list mobile-nav-toggle"></i>
                          </nav>
                          <!-- End: navbar -->
                        </div>
                      </header>
                      <!-- </div> -->
                      <!-- END: Border -->

                      <!-- ======= START: About Us ======= -->
                      <section id="about-us" class="about">
                        <div class="container" data-aos="fade-up">
                          <div class="section-title">
                            <h2>About</h2>
                          </div>
                          <div class=" row content">
                            <div class="mx-md-auto">
                              <p class="p-about-us">
                                
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>
                      <!-- END: About Myself Section  -->


                      <!-- ======= START: Login/Registration Form Section ======= -->
                      <section id="login-signup-form" class="skills section-bg">
                        <div class="container" data-aos="fade-up" style="margin: auto; display: inline-flexbox;">
                          <div class="row">
                            <div class="col-lg-6 pt-4 pt-lg-15" data-aos="fade-right" data-aos-delay="100">
                              <div class="section-title">
                                <h2>Login</h2>
                              </div>
                              <div class="skills-content">

                                <!--Form action to server.js using post method-->
                                <!--========START: Login Form=========-->
                                <form action="/Login" method="POST">
                                  <div>
                                    <label for="username" style="color:#000000;">Enter Username:<br />
                                      <input type="text" name="userName" style=" width: 400px; height: 40px; padding: 5px; margin-top: 5px;
                                      border: 1px solid gray;"/></label>
                                  </div>
                                  <div>
                                    <label for="Password" style="color: #000000;">Enter password:<br />
                                    <input type="password" name="password" style=" width: 400px; height: 40px; padding: 5px; margin-top: 5px;
                                    border: 1px solid gray;"/></label>
                                  </div>
                                  <br>
                                  <div class="div_input_submit">
                                    <button type="submit" class="btn_login">Login</button>
                                  </div>

                                  <!--Validation error message-->
                                  <div>
                                    <h2 id="result1"></h2>
                                    <h2 id="result2"></h2>
                                    <h2 id="result3"></h2>
                                    <h2 id="result4"></h2>
                                    <h2 id="result5"></h2>
                                    <h2 id="subscribe1"></h2>
                                    <h2 id="error"></h2>
                                  </div>
                                </form>
                              </div>
                            </div>
                            <!--========END: Login Form=========-->

                            <div class="col-lg-6 pt-4 pt-lg-15 " data-aos="fade-left" data-aos-delay="100">
                              <div class="section-title">
                                <h2>Sign Up</h2>
                              </div>
                              <div class="skills-content">
                                <form action="/Register" method="POST">
                                  <!-- onsubmit="onSUbmitHandler(event)" -->
                                  <div>
                                    <label for="username" style="color:#000000;">Enter Username:<br />
                                      <input type="text" name="userName" style=" width: 400px; height: 40px; padding: 5px; margin-top: 5px;
                                      border: 1px solid gray;"/></label>
                                  </div>
                                  <div>
                                    <label for="Password" style="color: #000000;">Enter Password</label><br />
                                    <input type="password" name="password"style=" width: 400px; height: 40px; padding: 5px;
                                    border: 1px solid gray;"/></label>
                                  </div>
                                  <br>
                                  <div class="div_input_submit">
                                    <button type="submit" class="btn_signup">Sign Up</button>
                                  </div>
                                  <div>
                                    <h2 id="result1"></h2>
                                    <h2 id="result2"></h2>
                                    <h2 id="result3"></h2>
                                    <h2 id="result4"></h2>
                                    <h2 id="result5"></h2>
                                    <h2 id="subscribe1"></h2>
                                    <h2 id="error"></h2>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <!-- ======= END: Login/Registration Form Section ======= -->

                      <!-- ======= Top footer ======= -->
                      <section id="contact-me" class="contact ">
                        <div class="container" data-aos="fade-up">
                          <div class="section-title">
                            <h2></h2>
                            <div class="row">
                              <!-- <div class="col-lg-5" style="margin:auto" style="border:1px solid black">
                                <div class="info">
                                  <div class="phone">
                                    <h4>Contact Number</h4>
                                    <p>8148496</p>
                                  </div>
                                  <div class="email">
                                    <h4>Email:</h4>
                                    <p><a href="mailto: mohdhifdzullah.matali@gmail.com">mohdhifdzullah.matali@gmail.com</a></p>
                                  </div>
                                </div>
                              </div> -->
                            </div>
                      </section>
                      <!-- End Contact Section -->
                    </main>
                    <!-- End #main -->

                    <!-- ======= Bottom Footer ======= -->
                    <footer id="footer">
                      <div class="container footer-bottom clearfix">
                        <div class="copyright">
                          &copy; Copyright <span>RescueMe 2023 <br>Hifdzullah Matali</span>
                        </div>
                      </div>
                    </footer>
                    <!-- End Footer -->

                    <div id="preloader"></div>
                    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i
                        class="bi bi-arrow-up-short"></i></a>

                    <!-- Vendor JS Files -->
                    <script src="assets/vendor/aos/aos.js"></script>
                    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
                    <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
                    <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
                    <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
                    <script src="assets/vendor/waypoints/noframework.waypoints.js"></script>
                    <script src="assets/vendor/php-email-form/validate.js"></script>

                    <!-- Template Main JS File -->
                    <script src="assets/js/main.js"></script>

                  </body>

                  </html>          
                `)
          }

          // inserting new user data
          var sql = `INSERT INTO tbl_auth_reg (username, password) VALUES ('${userName}', '${password}')`
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err)
            } else {
              // using userPage function for creating user page
              userPage()
            }
          })
        }
      }
    )
  })
})

// app.delete('/logout', (req, res) => {
//   if (req.session) {
//     req.session.destroy(err => {
//       if (err) {
//         res.status(400).send('Unable to log out')
//       } else {
//         res.send('Logout successful')
//       }
//     });
//   } else {
//     res.end()
//   }
// })

app.listen(4000, () => {
  console.log('Server running on port 4000')
})
