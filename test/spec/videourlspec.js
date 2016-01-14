(function() {
  var cl, protocol, test_cloudinary_url;

  cl = {};

  test_cloudinary_url = function(public_id, options, expected_url, expected_options) {
    var result;
    result = cl.url(public_id, options);
    expect(new cloudinary.Transformation(options).toHtmlAttributes()).toEqual(expected_options);
    return expect(result).toEqual(expected_url);
  };

  protocol = window.location.protocol === "file:" ? "http:" : window.location.protocol;

  describe("Cloudinary::Utils", function() {
    var root_path, upload_path;
    beforeEach(function() {
      return cl = new cloudinary.Cloudinary({
        cloud_name: "test123",
        secure_distribution: null,
        private_cdn: false,
        secure: false,
        cname: null,
        cdn_subdomain: false,
        api_key: "1234",
        api_secret: "b"
      });
    });
    root_path = protocol + "//res.cloudinary.com/test123";
    upload_path = root_path + "/video/upload";
    describe("cloudinary_url", function() {
      var i, len, long, ref, short;
      describe(":video_codec", function() {
        it('should support a string value', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            video_codec: 'auto'
          }, upload_path + "/vc_auto/video_id", {});
        });
        return it('should support a hash value', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            video_codec: {
              codec: 'h264',
              profile: 'basic',
              level: '3.1'
            }
          }, upload_path + "/vc_h264:basic:3.1/video_id", {});
        });
      });
      describe(":audio_codec", function() {
        return it('should support a string value', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            audio_codec: 'acc'
          }, upload_path + "/ac_acc/video_id", {});
        });
      });
      describe(":bit_rate", function() {
        it('should support an integer value', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            bit_rate: 2048
          }, upload_path + "/br_2048/video_id", {});
        });
        it('should support "<integer>k" ', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            bit_rate: '44k'
          }, upload_path + "/br_44k/video_id", {});
        });
        return it('should support "<integer>m"', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            bit_rate: '1m'
          }, upload_path + "/br_1m/video_id", {});
        });
      });
      describe(":audio_frequency", function() {
        return it('should support an integer value', function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            audio_frequency: 44100
          }, upload_path + "/af_44100/video_id", {});
        });
      });
      describe(":video_sampling", function() {
        it("should support an integer value", function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            video_sampling: 20
          }, upload_path + "/vs_20/video_id", {});
        });
        return it("should support an string value in the a form of \"<float>s\"", function() {
          return test_cloudinary_url("video_id", {
            resource_type: 'video',
            video_sampling: "2.3s"
          }, upload_path + "/vs_2.3s/video_id", {});
        });
      });
      ref = {
        so: 'start_offset',
        eo: 'end_offset',
        du: 'duration'
      };
      for (long = i = 0, len = ref.length; i < len; long = ++i) {
        short = ref[long];
        describe(":" + long, function() {
          it("should support decimal seconds ", function() {
            var op;
            op = {
              resource_type: 'video'
            };
            op[long] = 2.63;
            return test_cloudinary_url("video_id", op, upload_path + "/" + short + "_2.63/video_id", {});
          });
          it('should support percents of the video length as "<number>p"', function() {
            var op;
            op = {
              resource_type: 'video'
            };
            return op[long] = '35p';
          });
          test_cloudinary_url("video_id", op, upload_path + "/" + short + "_35p/video_id", {});
          it('should support percents of the video length as "<number>%"', function() {
            var op;
            op = {
              resource_type: 'video'
            };
            return op[long] = '35%';
          });
          return test_cloudinary_url("video_id", op, upload_path + "/" + short + "_35p/video_id", {});
        });
      }
      describe(":offset", function() {
        var j, len1, name, params, range, results, subject, test, url_param;
        subject = function(options) {
          return cl.url("video_id", options);
        };
        params = [['string range', 'so_2.66,eo_3.21', '2.66..3.21'], ['array', 'so_2.66,eo_3.21', [2.66, 3.21]], ['array of % strings', 'so_35p,eo_70p', ["35%", "70%"]], ['array of p strings', 'so_35p,eo_70p', ["35p", "70p"]], ['array of float percent', 'so_35.5p,eo_70.5p', ["35.5p", "70.5p"]]];
        results = [];
        for (j = 0, len1 = params.length; j < len1; j++) {
          test = params[j];
          name = test[0], url_param = test[1], range = test[2];
          describe("when provided with " + name + " " + range, function() {
            it("should produce a range transformation in the format of " + url_param, function() {
              var matched, options, transformation, url;
              options = {
                resource_type: 'video',
                offset: range
              };
              url = cl.url("video_id", options);
              matched = /([^\/]*)\/video_id$/.exec(url);
              transformation = matched ? matched[1] : '';
              return expect(transformation.split(',').sort().reverse().join(',')).toEqual(url_param);
            });
            return true;
          });
          results.push(true);
        }
        return results;
      });
      return describe("when given existing relevant parameters: 'quality', :background, :crop, :width, :height, :gravity, :overlay", function() {
        var j, len1, letter, param, ref1;
        ref1 = {
          overlay: 'l',
          underlay: 'u'
        };
        for (letter = j = 0, len1 = ref1.length; j < len1; letter = ++j) {
          param = ref1[letter];
          it("should support " + param, function() {
            var op;
            op = {
              resource_type: 'video'
            };
            op[param] = "text:hello";
            return test_cloudinary_url("test", op, upload_path + "/" + letter + "_text:hello/test", {});
          });
          it("should not pass width/height to html for " + param, function() {
            var op;
            op = {
              resource_type: 'video',
              height: 100,
              width: 100
            };
            op[param] = "text:hello";
            return test_cloudinary_url("test", op, upload_path + "/h_100," + letter + "_text:hello,w_100/test", {});
          });
        }
        return it("should produce the transformation string", function() {
          test_cloudinary_url("test", {
            resource_type: 'video',
            background: "#112233"
          }, upload_path + "/b_rgb:112233/test", {});
          return test_cloudinary_url("test", {
            resource_type: 'video',
            x: 1,
            y: 2,
            radius: 3,
            gravity: 'center',
            quality: 0.4,
            prefix: "a"
          }, upload_path + "/g_center,p_a,q_0.4,r_3,x_1,y_2/test", {});
        });
      });
    });
    return describe('cloudinary.video_thumbnail_url', function() {
      return it("should generate a cloudinary URI to the video thumbnail", function() {
        var options, path, source;
        source = "movie_id";
        options = {
          cloud_name: "test123"
        };
        path = cl.video_thumbnail_url(source, options);
        return expect(path).toEqual(upload_path + "/movie_id.jpg");
      });
    });
  });

  describe("video", function() {
    var DEFAULT_UPLOAD_PATH, VIDEO_UPLOAD_PATH;
    VIDEO_UPLOAD_PATH = protocol + "//res.cloudinary.com/test123/video/upload/";
    DEFAULT_UPLOAD_PATH = protocol + "//res.cloudinary.com/test123/image/upload/";
    beforeEach(function() {
      return cl = new cloudinary.Cloudinary({
        cloud_name: "test123",
        api_secret: "1234"
      });
    });
    it("should generate video tag", function() {
      var expected_url, tag;
      expected_url = VIDEO_UPLOAD_PATH + "movie";
      tag = cl.video("movie");
      expect(tag).toContain("<video poster=\"" + expected_url + ".jpg\">");
      expect(tag).toContain("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">");
      expect(tag).toContain("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">");
      return expect(tag).toContain("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">");
    });
    it("should generate video tag with html5 attributes", function() {
      var expected_url, tag;
      expected_url = VIDEO_UPLOAD_PATH + "movie";
      tag = cl.video("movie", {
        autoplay: 1,
        controls: true,
        loop: true,
        muted: "true",
        preload: true,
        style: "border: 1px"
      });
      expect(tag).toContain("<video autoplay=\"1\" controls loop muted=\"true\" poster=\"" + expected_url + ".jpg\" preload style=\"border: 1px\">");
      expect(tag).toContain("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">");
      expect(tag).toContain("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">");
      return expect(tag).toContain("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">");
    });
    it("should generate video tag with various attributes", function() {
      var expected_url, options;
      options = {
        source_types: "mp4",
        html_height: "100",
        html_width: "200",
        video_codec: {
          codec: "h264"
        },
        audio_codec: "acc",
        start_offset: 3
      };
      expected_url = VIDEO_UPLOAD_PATH + "ac_acc,so_3,vc_h264/movie";
      expect(cl.video("movie", options)).toEqual("<video height=\"100\" poster=\"" + expected_url + ".jpg\" src=\"" + expected_url + ".mp4\" width=\"200\"></video>");
      delete options['source_types'];
      expect(cl.video("movie", options)).toEqual(("<video height=\"100\" poster=\"" + expected_url + ".jpg\" width=\"200\">") + ("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">") + ("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">") + ("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">") + "</video>");
      delete options['html_height'];
      delete options['html_width'];
      options['width'] = 250;
      options['crop'] = 'scale';
      expected_url = VIDEO_UPLOAD_PATH + "ac_acc,c_scale,so_3,vc_h264,w_250/movie";
      expect(cl.video("movie", options)).toEqual(("<video poster=\"" + expected_url + ".jpg\" width=\"250\">") + ("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">") + ("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">") + ("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">") + "</video>");
      expected_url = VIDEO_UPLOAD_PATH + "ac_acc,c_fit,so_3,vc_h264,w_250/movie";
      options['crop'] = 'fit';
      return expect(cl.video("movie", options)).toEqual(("<video poster=\"" + expected_url + ".jpg\">") + ("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">") + ("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">") + ("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">") + "</video>");
    });
    it("should generate video tag with fallback", function() {
      var expected_url, fallback;
      expected_url = VIDEO_UPLOAD_PATH + "movie";
      fallback = "<span id=\"spanid\">Cannot display video</span>";
      expect(cl.video("movie", {
        fallback_content: fallback
      }), ("<video poster=\"" + expected_url + ".jpg\">") + ("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">") + ("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">") + ("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">") + fallback + "</video>");
      return expect(cl.video("movie", {
        fallback_content: fallback,
        source_types: "mp4"
      })).toEqual(("<video poster=\"" + expected_url + ".jpg\" src=\"" + expected_url + ".mp4\">") + fallback + "</video>");
    });
    it("should generate video tag with source types", function() {
      var expected_url;
      expected_url = VIDEO_UPLOAD_PATH + "movie";
      return expect(cl.video("movie", {
        source_types: ['ogv', 'mp4']
      })).toEqual(("<video poster=\"" + expected_url + ".jpg\">") + ("<source src=\"" + expected_url + ".ogv\" type=\"video/ogg\">") + ("<source src=\"" + expected_url + ".mp4\" type=\"video/mp4\">") + "</video>");
    });
    it("should generate video tag with source transformation", function() {
      var expected_mp4_url, expected_ogv_url, expected_url;
      expected_url = VIDEO_UPLOAD_PATH + "q_50/c_scale,w_100/movie";
      expected_ogv_url = VIDEO_UPLOAD_PATH + "q_50/c_scale,q_70,w_100/movie";
      expected_mp4_url = VIDEO_UPLOAD_PATH + "q_50/c_scale,q_30,w_100/movie";
      expect(cl.video("movie", {
        width: 100,
        crop: "scale",
        transformation: {
          'quality': 50
        },
        source_transformation: {
          'ogv': {
            'quality': 70
          },
          'mp4': {
            'quality': 30
          }
        }
      })).toEqual(("<video poster=\"" + expected_url + ".jpg\" width=\"100\">") + ("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">") + ("<source src=\"" + expected_mp4_url + ".mp4\" type=\"video/mp4\">") + ("<source src=\"" + expected_ogv_url + ".ogv\" type=\"video/ogg\">") + "</video>");
      return expect(cl.video("movie", {
        width: 100,
        crop: "scale",
        transformation: {
          'quality': 50
        },
        source_transformation: {
          'ogv': {
            'quality': 70
          },
          'mp4': {
            'quality': 30
          }
        },
        source_types: ['webm', 'mp4']
      })).toEqual(("<video poster=\"" + expected_url + ".jpg\" width=\"100\">") + ("<source src=\"" + expected_url + ".webm\" type=\"video/webm\">") + ("<source src=\"" + expected_mp4_url + ".mp4\" type=\"video/mp4\">") + "</video>");
    });
    return describe("poster", function() {
      var expected_url;
      expected_url = VIDEO_UPLOAD_PATH + "movie";
      it("should accept a URL", function() {
        var expected_poster_url;
        expected_poster_url = 'http://image/somewhere.jpg';
        return expect(cl.video("movie", {
          poster: expected_poster_url,
          source_types: "mp4"
        })).toEqual("<video poster=\"" + expected_poster_url + "\" src=\"" + expected_url + ".mp4\"></video>");
      });
      it("should accept an object", function() {
        var expected_poster_url;
        expected_poster_url = VIDEO_UPLOAD_PATH + "g_north/movie.jpg";
        return expect(cl.video("movie", {
          poster: {
            'gravity': 'north'
          },
          source_types: "mp4"
        })).toEqual("<video poster=\"" + expected_poster_url + "\" src=\"" + expected_url + ".mp4\"></video>");
      });
      it("should accept a different public ID", function() {
        var expected_poster_url;
        expected_poster_url = DEFAULT_UPLOAD_PATH + "g_north/my_poster.jpg";
        return expect(cl.video("movie", {
          poster: {
            'gravity': 'north',
            'public_id': 'my_poster',
            'format': 'jpg'
          },
          source_types: "mp4"
        })).toEqual("<video poster=\"" + expected_poster_url + "\" src=\"" + expected_url + ".mp4\"></video>");
      });
      it("should accept an empty string", function() {
        return expect(cl.video("movie", {
          poster: "",
          source_types: "mp4"
        })).toEqual("<video src=\"" + expected_url + ".mp4\"></video>");
      });
      return it("should accept 'false'", function() {
        return expect(cl.video("movie", {
          poster: false,
          source_types: "mp4"
        })).toEqual("<video src=\"" + expected_url + ".mp4\"></video>");
      });
    });
  });

}).call(this);
