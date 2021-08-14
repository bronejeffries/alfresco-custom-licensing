<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Colorlib Templates">
    <meta name="author" content="Colorlib">
    <meta name="keywords" content="Colorlib Templates">

    <!-- Title Page-->
    <title>Add new license</title>

    <!-- Font special for pages-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet">

    <!-- Main CSS-->
    <link href="/share/res/components/customlicense/css/main.css" rel="stylesheet" media="all">
</head>

<body>
    <div class="page-wrapper bg-dark p-t-100 p-b-50">
        <div class="wrapper wrapper--w900">
            <div class="card card-6">
                <div class="card-heading">
                    <h2 class="title">Add New License</h2>
                </div>
                <form id="yiu_liessa_naj_dojo_license_form" method="POST">
                    <div class="card-body">
                        <div class="form-row">
                            <div class="name">License key *</div>
                            <div class="value">
                                <div class="input-group">
                                    <textarea class="textarea--style-6" required placeholder="Provide license key here" id="license_key" name="license_key"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="name">Secret key *</div>
                            <div class="value">
                                <input required placeholder="Provide secret key here eg. xxxx-xxxx-xxxx-xxxx-xxxx" class="input--style-6" type="text" id="secret_key" name="secret_key">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="name">Customer Details *</div>
                            <div class="value">
                                <div class="input-group">
                                    <input class="input--style-6" required readonly type="text" id="customer_details" name="customer_details" placeholder="Customer details">
                                </div>
                            </div>
                        </div>
                        <#--  <div class="form-row">
                            <div class="name">Message</div>
                            <div class="value">
                                <div class="input-group">
                                    <textarea class="textarea--style-6" name="message" placeholder="Message sent to the employer"></textarea>
                                </div>
                            </div>
                        </div>  -->
                        <#--  <div class="form-row">
                            <div class="name">Upload CV</div>
                            <div class="value">
                                <div class="input-group js-input-file">
                                    <input class="input-file" type="file" name="file_cv" id="file">
                                    <label class="label--file" for="file">Choose file</label>
                                    <span class="input-file__info">No file chosen</span>
                                </div>
                                <div class="label--desc">Upload your CV/Resume or any other relevant file. Max file size 50 MB</div>
                            </div>
                        </div>  -->
                        <div class="form-row">
                            <div class="name">License Type *</div>
                            <div class="value">
                                <div class="input-group">
                                    <input class="input--style-6" required readonly type="text" id="license_type" name="license_type" placeholder="License Type">
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="name">License Limit *</div>
                            <div class="value">
                                <div class="input-group">
                                    <input class="input--style-6" readonly required type="text" id="license_limit" name="license_limit" placeholder="License Limit">
                                </div>
                            </div>
                        </div>
                        <#--  <div class="form-row">
                            <div class="name">License Validity Span (days)</div>
                            <div class="value">
                                <div class="input-group">
                                    <input class="input--style-6" readonly type="text" id="license_span" name="license_span" placeholder="License Validity Span">
                                </div>
                            </div>
                        </div>  -->
                        <#--  <div class="form-row">
                            <div class="name">Activation Date</div>
                            <div class="value">
                                <div class="input-group">
                                    <input class="input--style-6" readonly type="text" id="activation_date" name="activation_date" placeholder="Activation Date">
                                </div>
                            </div>
                        </div>  -->
                        <div class="form-row">
                            <div class="name">Choose Users *</div>
                            <div class="value">
                                <div class="input-group">
                                    <select required class="input--style-6" id="license_users" name="license_users">
                                        <option>Select User(s)....</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn--radius-2 btn--blue-2" type="submit">Save License</button>
                    </div>
                </form>
                
            </div>
        </div>
    </div>

    <!-- Jquery JS-->
    <script src="/share/res/components/customlicense/vendor/jquery/jquery.min.js"></script>


    <!-- Main JS-->
    <script src="/share/res/components/customlicense/js/global.js"></script>
    <#--  <script src="/share/res/components/customlicense/js/license_users.js"></script>  -->
        <script src="/share/res/components/customlicense/js/business_external.js"></script>

</body><!-- This templates was made by Colorlib (https://colorlib.com) -->

</html>
<!-- end document-->