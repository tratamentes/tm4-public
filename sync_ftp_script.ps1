# Configuração do FTP
$ftpServer = "ftp.tratamentes.pt"
$ftpUsername = "tm4%40dev.tratamentes.pt"  # Substituir %40 por '@' se necessário
$ftpPassword = "ANbTxt3Rk2ynT8Q"
$localPath = "C:\Users\joaog\OneDrive\Documents\sites\tm4\tm4\dist"
$remotePath = "/"

# Função para apagar todo o conteúdo no servidor FTP
function Delete-FtpDirectory {
    param (
        [string]$ftpUrl,
        [string]$username,
        [string]$password
    )

    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $response = $ftpRequest.GetResponse()
        $reader = [System.IO.StreamReader]::new($response.GetResponseStream())

        while (($line = $reader.ReadLine()) -ne $null) {
            $childUrl = "$ftpUrl/$line"
            $ftpRequest = [System.Net.FtpWebRequest]::Create($childUrl)
            $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($username, $password)

            if ($line.EndsWith("/")) {
                # Diretório - apagar recursivamente
                Delete-FtpDirectory -ftpUrl $childUrl -username $username -password $password
            } else {
                # Ficheiro - apagar diretamente
                $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
                $ftpRequest.GetResponse().Close()
                Write-Host "Deleted file: $childUrl"
            }
        }

        $reader.Close()
        $response.Close()

        # Apagar o diretório atual
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::RemoveDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $ftpRequest.GetResponse().Close()
        Write-Host "Deleted directory: $ftpUrl"
    } catch {
        Write-Host "Error deleting: $ftpUrl ($_). It may not exist."
    }
}

# Função para criar diretórios no servidor FTP
function Create-FtpDirectory {
    param (
        [string]$ftpUrl,
        [string]$username,
        [string]$password
    )

    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $ftpRequest.GetResponse().Close()
        Write-Host "Created directory: $ftpUrl"
    } catch {
        Write-Host "Directory already exists or error creating: $ftpUrl"
    }
}

# Função para enviar ficheiros via FTP
function Upload-FtpFile {
    param (
        [string]$ftpUrl,
        [string]$localFile,
        [string]$username,
        [string]$password
    )

    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    $ftpRequest.UseBinary = $true

    $fileContent = [System.IO.File]::ReadAllBytes($localFile)
    $ftpRequest.ContentLength = $fileContent.Length

    $requestStream = $ftpRequest.GetRequestStream()
    $requestStream.Write($fileContent, 0, $fileContent.Length)
    $requestStream.Close()

    $ftpRequest.GetResponse().Close()
    Write-Host "Uploaded: $localFile to $ftpUrl"
}

# Passo 1: Apagar todo o conteúdo remoto
Write-Host "Deleting remote directory: $remotePath"
Delete-FtpDirectory -ftpUrl "ftp://$ftpServer$remotePath" -username $ftpUsername -password $ftpPassword

# Passo 2: Recriar estrutura e enviar ficheiros
$localItems = Get-ChildItem -Recurse -Path $localPath

foreach ($item in $localItems) {
    $relativePath = $item.FullName.Substring($localPath.Length).TrimStart('\')
    $remoteItemPath = "$remotePath/$relativePath".Replace('\', '/')
    $ftpUrl = "ftp://$ftpServer$remoteItemPath"

    if ($item.PSIsContainer) {
        # Criar diretório no servidor
        Create-FtpDirectory -ftpUrl $ftpUrl -username $ftpUsername -password $ftpPassword
    } else {
        # Enviar ficheiro para o servidor
        Upload-FtpFile -ftpUrl $ftpUrl -localFile $item.FullName -username $ftpUsername -password $ftpPassword
    }
}

Write-Host "Sync complete. Connection closed."
