jQuery(function($) {
	// home과 겹치는 부분은 home.html을 참고바랍니다.
	var U = SmartHomeUI.init();

	// home과 겹치는 부분 시작
	$('.bt-sign-up').on('click', function() {
		signUp(true);
	});

	function signUp() {

		// 회원가입을 시작합니다.
		goStep1();

		function goStep1() {
			U.dialog({
				templateId: 'dialog-template-sign-up-step1',
				onOpen: function(context) {
					$(context).find('form').first().on('submit', function() {
						goStep2();
						return false;
					});
				},
				onClose: function(context, finish) {
					finish();
				}
			});
		}

		function goStep2() {
			U.dialog({
				templateId: 'dialog-template-sign-up-step2',
				onOpen: function(context) {
					var $context = $(context);
					var $form = $context.find('form').last().on('submit', function() {
						goStep3();
						return false;
					});
					setTimeout(function() {
						U.invalidate($form.find('input').first(), '테스트 에러 메시지');
						setTimeout(function() {
							U.invalidate($form.find('input').first());
						}, 1500);
					}, 1500);
					$context.find('.bt-prev').on('click', function() {
						goStep1();
						return false;
					});
				}
			});
		}

		function goStep3() {
			U.dialog({
				templateId: 'dialog-template-sign-up-step3',
				onOpen: function(context) {
					var $context = $(context);
					$context.find('form').last().on('submit', function() {
						goFinish();
						return false;
					});

					$context.find('.bt-prev').on('click', function() {
						goStep2();
						return false;
					});
				}
			});
		}

		function goFinish() {
			U.dialog({
				templateId: 'dialog-template-sign-up-success',
				onOpen: function(context) {
					$(context).find('.bt-confirm').on('click', function() {
						U.dialog();
						return false;
					});
				},
				onClose: function(context, finish) {
					finish();
				}
			});
		}

		return false;
	}

	$('.bt-log-in').on('click', login);

	function login() {
		U.dialog({
			templateId: 'dialog-template-log-in',
			onOpen: function(context) {
				var $context = $(context);

				$context.find('.bt-sign-up').on('click', function() {
					signUp(true);
				});

				$context.find('.bt-find-id-and-password').on('click', function() {
					findIdOrPassword('id');
				});

				$('button').click(function(){
					if(this.className == 'bt-log-in') {
						loginCheckForm();
					}
				});
			}
		});
	}

	function startLoginTransaction(url, params, type, dataType, callback) {
		var that = this;
        $.ajax({
            url: "http://mobiledev.sktsmarthome.com:9002/"+url,
            data: params,
            type: type,
            dataType: dataType,
            success: function(response) {
                callback(response);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log('실패 - ', xhr);
            }
        });
	}

	function parseLoginTransaction(response) {
		console.log('parseLoginTransaction : ' + response);
		/*
			expEndDay: ""
			loginId: "btb@btb.com"
			modeSer: ""
			notifSetYn: ""
			resultCd: "1"
			resultMsg: "성공"
			rnmCertYn: "N"
			rsdcDefltAddr: null
			rsdcDetailAddr: null
			rsdcLatLoca: null
			rsdcLongLoca: null
			svrfileUrl: "1"
			userAuthCd: "GEN"
			userCertTknVal: "vBVbrb88bK6Ns0EaKsTnPkYxoB3mG4U3HUlSZptaMMzqs1QGUXyrOmRbI5fFQ0cN"
			userIdEncoded: "e1ygX943/2Wi0eb7NOoxC7AosV+r6FI8"
			userMobileNo: "01032853908"
			userNickNm: "비티비테스트"
		*/
		if (resultCd && resultMsg) {
			if (resultCd == '1' && resultMsg == '성공') {
				// 1. 쿠키에 정보를 저장한다.
				//	1-1. 아이디
				//	1-2. 닉네임
			} else {
				// 로그인 실패.
			}
		} else {
			// 로그인 실패.
		}
	}

	function loginCheckForm() {
		var $myId = $('#myId');
		var $myPass = $('#myPass');
		var params = {}, url='v1/member/login', type='GET', dataType = 'json';


		if ($myId.val().length == 0) {
			alert('아이디(이메일)을 입력하세요');
			$myId.focus();
			return false;
		} else if ($myPass.val().length == 0) {
			alert('비밀번호 입력하세요');
			$myPass.focus();
			return false;
		} else {
			params = {				
				loginId:$myId.val(),
				loginPwd:$myPass.val(),
				pushTknVal:'34r234',
				dvcTknVal:'234r234',
				dvcOsNm:'d12d12'
			};
			startLoginTransaction(url, params, type, dataType, function(response){
				parseLoginTransaction(response);
			});
		}


	}

	function findIdOrPassword(target) {

		switch (target) {
		case 'id':
			U.dialog({
				templateId: 'dialog-template-find-id-form',
				onOpen: function(context) {
					var $context = $(context);

					$context.find('.bt-find-password').on('click', function() {
						findIdOrPassword('password');
					});

					$context.find('form').last().on('submit', function() {
						U.dialog({
							templateId: 'dialog-template-find-id-success',
							onOpen: function(context) {
								var $context = $(context);

								// 서버로부터 가져온 email 목록을 추가합니다.
								var results = [
									'aaaa@bbbbb.com',
									'cccc@ddddd.com',
									'eeee@fffff.com',
									'gggg@hhhhh.com',
									'iiii@jjjjj.com'
								];

								results = $.map(results, function(v) {
									return '<li>' + v + '</li>';
								});

								$context.find('.ids').html(results.join(''));
								//-- END

								$context.find('.bt-find-password').on('click', function() {
									findIdOrPassword('password');
								});

								$context.find('.bt-log-in').on('click', login);
							}
						});
					});
				}
			});
			break;
		case 'password':
			U.dialog({
				templateId: 'dialog-template-find-password-form',
				onOpen: function(context) {
					var $context = $(context);

					$context.find('.bt-find-id').on('click', function() {
						findIdOrPassword('id');
					});

					$context.find('form').last().on('submit', function() {
						U.dialog({
							templateId: 'dialog-template-find-password-success',
							onOpen: function(context) {
								var $context = $(context);

								$context.find('.bt-confirm').on('click', function() {
									U.dialog();
								});
							}
						})
					});
				}
			});
			break;
		default:
			// NO DEFAULT
		}
	}
	//-- home과 겹치는 부분 종료
});