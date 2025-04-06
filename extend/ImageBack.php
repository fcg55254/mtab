<?php

class ImageBack
{
    protected $filename;
    protected $fileExt = "";
    protected $croppedWidth = 0;
    protected $croppedHeight = 0;
    protected $width = 0;
    protected $height = 0;
    protected $croppedX = 0;
    protected $croppedY = 0;
    protected $source;
    protected $cropped;
    protected $process = true;
    protected $funName = "jpeg";

    function __construct($filename)
    {
        $this->filename = $filename;
        $fileExt = pathinfo($filename, PATHINFO_EXTENSION);
        $this->fileExt = $fileExt;
        switch ($this->fileExt) {
            case 'jpg':
            case 'jpeg':
                $this->funName = "jpeg";
                break;
            case 'png':
                $this->funName = 'png';
                break;
            case 'webp':
                $this->funName = 'webp';
                break;
            default:
                $this->process = false;
        }
        if ($this->process) {
            $fun = 'imagecreatefrom' . $this->funName;
            $this->source = $fun($filename);
            $this->width = imagesx($this->source);
            $this->height = imagesy($this->source);
        }
    }

    public function resize($croppedWidth, $croppedHeight = 0, $croppedX = 0, $croppedY = 0): ImageBack
    {
        if ($this->process) {
            $this->croppedHeight = $croppedHeight;
            $this->croppedWidth = $croppedWidth;
            $this->croppedX = $croppedX;
            $this->croppedY = $croppedY;
            if ($croppedWidth >= $this->width) {
                $this->croppedWidth = $this->width;
            }
            if ($croppedHeight == 0) {
                $this->croppedHeight = (int)($this->height / ($this->width / $this->croppedWidth));
            } else if ($croppedHeight >= $this->height) {
                $this->croppedHeight = $this->height;
            }
            $this->cropped = imagecreatetruecolor($this->croppedWidth, $this->croppedHeight);
            if ($this->funName == 'png'|| $this->funName == 'webp') {
                // 将图像设置为支持 alpha 通道的模式
                imagealphablending($this->cropped, false);
                imagesavealpha($this->cropped, true);
                $transparentColor = imagecolorallocatealpha($this->cropped, 0, 0, 0, 127);
                imagefill($this->cropped, 0, 0, $transparentColor);
            }
        }
        return $this;
    }

    public function save($savePath)
    {
        if ($this->process) {
            try {
                imagecopyresampled($this->cropped, $this->source, 0, 0, 0, 0, $this->croppedWidth, $this->croppedHeight, $this->width, $this->height);
                $fun = 'image' . $this->funName;
                $fun($this->cropped, $savePath);
                imagedestroy($this->source);
                return true;
            } catch (Exception $exception) {
                return $exception->getMessage();
            }
        }
        return false;
    }
}